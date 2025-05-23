
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

interface Poster {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  created_at: string;
  updated_at?: string;
  is_best_seller?: boolean;
  is_trending?: boolean;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
}

const PosterManagement = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newPoster, setNewPoster] = useState({
    title: '',
    description: '',
    image_url: '',
    price: 0,
    category: ''
  });
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const queryClient = useQueryClient();

  // Fetch posters
  const { isLoading: isLoadingPosters, error: errorPosters, data: postersData } = useQuery({
    queryKey: ['posters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posters')
        .select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });

  // Create a dummy categories fetch since we're using the 'category' field directly
  const { isLoading: isLoadingCategories, error: errorCategories, data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Extract unique categories from posters
      const { data: postersForCategories, error } = await supabase
        .from('posters')
        .select('category');
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Create unique categories array
      const uniqueCategories = Array.from(
        new Set(postersForCategories.map(poster => poster.category).filter(Boolean))
      ).map(categoryName => ({
        id: categoryName,
        name: categoryName
      }));
      
      return uniqueCategories as Category[];
    }
  });

  useEffect(() => {
    if (postersData) {
      setPosters(postersData as Poster[]);
    }
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [postersData, categoriesData]);

  // Mutations for CRUD operations
  const createPosterMutation = useMutation({
    mutationFn: async (newPosterData: Omit<typeof newPoster, 'id'>) => {
      const { data, error } = await supabase
        .from('posters')
        .insert([newPosterData])
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster created successfully!');
      setNewPoster({ title: '', description: '', image_url: '', price: 0, category: '' }); // Reset form
    },
    onError: (error: any) => {
      toast.error(`Failed to create poster: ${error.message}`);
    },
  });

  const updatePosterMutation = useMutation({
    mutationFn: async (updatedPoster: Poster) => {
      const { data, error } = await supabase
        .from('posters')
        .update(updatedPoster)
        .eq('id', updatedPoster.id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster updated successfully!');
      setSelectedPoster(null); // Clear selected poster after update
    },
    onError: (error: any) => {
      toast.error(`Failed to update poster: ${error.message}`);
    },
  });

  const deletePosterMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('posters')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete poster: ${error.message}`);
    },
  });

  const handleCreatePoster = async () => {
    if (!newPoster.title || !newPoster.description || !newPoster.image_url || !newPoster.price || !newPoster.category) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await createPosterMutation.mutate({
        ...newPoster,
        price: Number(newPoster.price),
      });
    } catch (error: any) {
      toast.error(`Failed to create poster: ${error.message}`);
    }
  };

  const handleUpdatePoster = async () => {
    if (!selectedPoster) return;

    try {
      await updatePosterMutation.mutate(selectedPoster);
    } catch (error: any) {
      toast.error(`Failed to update poster: ${error.message}`);
    }
  };

  const handleDeletePoster = async (id: string) => {
    try {
      await deletePosterMutation.mutate(id);
    } catch (error: any) {
      toast.error(`Failed to delete poster: ${error.message}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPoster({ ...newPoster, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoadingPosters || isLoadingCategories) return <div>Loading...</div>;
  if (errorPosters) return <div>Error: {errorPosters.message}</div>;
  if (errorCategories) return <div>Error: {errorCategories.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Poster Management</h1>

      {/* Create Poster Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New Poster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={newPoster.title}
              onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              value={newPoster.price}
              onChange={(e) => setNewPoster({ ...newPoster, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded"
              value={newPoster.category}
              onChange={(e) => setNewPoster({ ...newPoster, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newPoster.image_url && (
              <img src={newPoster.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newPoster.description}
              onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
            />
          </div>
        </div>
        <Button onClick={handleCreatePoster} className="mt-4">
          {createPosterMutation.isPending ? 'Creating...' : 'Create Poster'}
        </Button>
      </div>

      {/* Display Posters in a Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Posters</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your posters.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posters.map((poster) => {
                const category = categories.find(cat => cat.id === poster.category);
                return (
                  <TableRow key={poster.id}>
                    <TableCell>
                      <img src={poster.image_url} alt={poster.title} className="h-16 w-16 object-cover rounded" />
                    </TableCell>
                    <TableCell>{poster.title}</TableCell>
                    <TableCell>{poster.description}</TableCell>
                    <TableCell>${poster.price}</TableCell>
                    <TableCell>{category ? category.name : poster.category || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit poster</DialogTitle>
                              <DialogDescription>
                                Make changes to the selected poster here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                  Title
                                </Label>
                                <Input
                                  type="text"
                                  id="title"
                                  value={selectedPoster?.title || poster.title}
                                  onChange={(e) => setSelectedPoster({ ...poster, title: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  value={selectedPoster?.description || poster.description}
                                  onChange={(e) => setSelectedPoster({ ...poster, description: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  Price
                                </Label>
                                <Input
                                  type="number"
                                  id="price"
                                  value={selectedPoster?.price || poster.price}
                                  onChange={(e) => setSelectedPoster({ ...poster, price: Number(e.target.value) })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                  Category
                                </Label>
                                <select
                                  id="category"
                                  className="col-span-3 w-full p-2 border rounded"
                                  value={selectedPoster?.category || poster.category || ''}
                                  onChange={(e) => setSelectedPoster({ ...poster, category: e.target.value })}
                                >
                                  <option value="">Select a category</option>
                                  {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                  Image
                                </Label>
                                <Input
                                  type="file"
                                  id="image"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setSelectedPoster({ ...poster, image_url: reader.result as string });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="col-span-3"
                                />
                                {selectedPoster?.image_url && (
                                  <img src={selectedPoster.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                                )}
                              </div>
                            </div>
                            <Button onClick={handleUpdatePoster}>
                              {updatePosterMutation.isPending ? 'Updating...' : 'Update Poster'}
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePoster(poster.id)}>
                          {deletePosterMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PosterManagement;
