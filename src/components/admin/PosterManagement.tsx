
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { Upload, Trash2, Edit } from 'lucide-react';

interface Poster {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  price_category: 'budget' | 'standard' | 'premium';
  created_at: string;
  updated_at?: string;
  is_best_seller?: boolean;
  is_trending?: boolean;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

const PRICE_CATEGORIES = [
  { value: 'budget', label: 'Budget (₹0-₹500)', min: 0, max: 500 },
  { value: 'standard', label: 'Standard (₹501-₹1500)', min: 501, max: 1500 },
  { value: 'premium', label: 'Premium (₹1501+)', min: 1501, max: Infinity }
];

const PosterManagement = () => {
  const [newPoster, setNewPoster] = useState({
    title: '',
    description: '',
    image_url: '',
    price: 0,
    category: '',
    price_category: 'standard' as const,
    is_best_seller: false,
    is_trending: false,
    stock: 0
  });
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch posters
  const { data: posters = [], isLoading: isLoadingPosters } = useQuery({
    queryKey: ['posters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Poster[];
    }
  });

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw new Error(error.message);
      return data as Category[];
    }
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('posters')
        .upload(fileName, file);
      if (error) throw new Error(error.message);
      
      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(fileName);
      
      return publicUrl;
    }
  });

  // Create poster mutation
  const createPosterMutation = useMutation({
    mutationFn: async (posterData: typeof newPoster) => {
      const { data, error } = await supabase
        .from('posters')
        .insert([posterData])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster created successfully!');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create poster: ${error.message}`);
    },
  });

  // Update poster mutation
  const updatePosterMutation = useMutation({
    mutationFn: async (updatedPoster: Poster) => {
      const { data, error } = await supabase
        .from('posters')
        .update(updatedPoster)
        .eq('id', updatedPoster.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster updated successfully!');
      setSelectedPoster(null);
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update poster: ${error.message}`);
    },
  });

  // Delete poster mutation
  const deletePosterMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] });
      toast.success('Poster deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete poster: ${error.message}`);
    },
  });

  const resetForm = () => {
    setNewPoster({
      title: '',
      description: '',
      image_url: '',
      price: 0,
      category: '',
      price_category: 'standard',
      is_best_seller: false,
      is_trending: false,
      stock: 0
    });
    setImageFile(null);
  };

  const handleImageUpload = async (file: File, isEdit = false) => {
    try {
      const imageUrl = await uploadImageMutation.mutateAsync(file);
      if (isEdit && selectedPoster) {
        setSelectedPoster({ ...selectedPoster, image_url: imageUrl });
      } else {
        setNewPoster({ ...newPoster, image_url: imageUrl });
      }
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleCreatePoster = async () => {
    if (!newPoster.title || !newPoster.description || !newPoster.image_url || !newPoster.price || !newPoster.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (imageFile) {
      await handleImageUpload(imageFile);
    }

    try {
      await createPosterMutation.mutateAsync({
        ...newPoster,
        price: Number(newPoster.price),
        stock: Number(newPoster.stock),
      });
    } catch (error: any) {
      toast.error(`Failed to create poster: ${error.message}`);
    }
  };

  const handleUpdatePoster = async () => {
    if (!selectedPoster) return;

    try {
      await updatePosterMutation.mutateAsync({
        ...selectedPoster,
        price: Number(selectedPoster.price),
        stock: Number(selectedPoster.stock),
      });
    } catch (error: any) {
      toast.error(`Failed to update poster: ${error.message}`);
    }
  };

  const getPriceCategoryInfo = (category: string) => {
    return PRICE_CATEGORIES.find(pc => pc.value === category);
  };

  if (isLoadingPosters || isLoadingCategories) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Poster Management</h1>

      {/* Create Poster Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Poster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              type="text"
              id="title"
              value={newPoster.title}
              onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              type="number"
              id="price"
              value={newPoster.price}
              onChange={(e) => setNewPoster({ ...newPoster, price: Number(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              type="number"
              id="stock"
              value={newPoster.stock}
              onChange={(e) => setNewPoster({ ...newPoster, stock: Number(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={newPoster.category} onValueChange={(value) => setNewPoster({ ...newPoster, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price_category">Price Category</Label>
            <Select value={newPoster.price_category} onValueChange={(value: 'budget' | 'standard' | 'premium') => setNewPoster({ ...newPoster, price_category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select price category" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_CATEGORIES.map((pc) => (
                  <SelectItem key={pc.value} value={pc.value}>
                    {pc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">Image Upload *</Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewPoster({ ...newPoster, image_url: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {newPoster.image_url && (
              <img src={newPoster.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border" />
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={newPoster.description}
              onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="trending"
                checked={newPoster.is_trending}
                onCheckedChange={(checked) => setNewPoster({ ...newPoster, is_trending: checked })}
              />
              <Label htmlFor="trending">Mark as Trending</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="bestseller"
                checked={newPoster.is_best_seller}
                onCheckedChange={(checked) => setNewPoster({ ...newPoster, is_best_seller: checked })}
              />
              <Label htmlFor="bestseller">Mark as Best Seller</Label>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCreatePoster} 
          className="mt-6"
          disabled={createPosterMutation.isPending}
        >
          {createPosterMutation.isPending ? 'Creating...' : 'Create Poster'}
        </Button>
      </div>

      {/* Posters Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Existing Posters</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Price Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posters.map((poster) => (
                <TableRow key={poster.id}>
                  <TableCell>
                    <img src={poster.image_url} alt={poster.title} className="h-16 w-16 object-cover rounded border" />
                  </TableCell>
                  <TableCell className="font-medium">{poster.title}</TableCell>
                  <TableCell>{poster.category}</TableCell>
                  <TableCell>₹{poster.price}</TableCell>
                  <TableCell>
                    <Badge variant={poster.price_category === 'premium' ? 'default' : poster.price_category === 'standard' ? 'secondary' : 'outline'}>
                      {poster.price_category}
                    </Badge>
                  </TableCell>
                  <TableCell>{poster.stock || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {poster.is_trending && <Badge variant="destructive" className="text-xs">Trending</Badge>}
                      {poster.is_best_seller && <Badge variant="default" className="text-xs">Best Seller</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPoster(poster);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePosterMutation.mutate(poster.id)}
                        disabled={deletePosterMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Poster</DialogTitle>
            <DialogDescription>
              Make changes to the selected poster here.
            </DialogDescription>
          </DialogHeader>
          {selectedPoster && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedPoster.title}
                    onChange={(e) => setSelectedPoster({ ...selectedPoster, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    type="number"
                    id="edit-price"
                    value={selectedPoster.price}
                    onChange={(e) => setSelectedPoster({ ...selectedPoster, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={selectedPoster.category} onValueChange={(value) => setSelectedPoster({ ...selectedPoster, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price-category">Price Category</Label>
                  <Select value={selectedPoster.price_category} onValueChange={(value: 'budget' | 'standard' | 'premium') => setSelectedPoster({ ...selectedPoster, price_category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_CATEGORIES.map((pc) => (
                        <SelectItem key={pc.value} value={pc.value}>
                          {pc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  type="number"
                  id="edit-stock"
                  value={selectedPoster.stock || 0}
                  onChange={(e) => setSelectedPoster({ ...selectedPoster, stock: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPoster.description}
                  onChange={(e) => setSelectedPoster({ ...selectedPoster, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image Upload</Label>
                <Input
                  type="file"
                  id="edit-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file, true);
                    }
                  }}
                />
                {selectedPoster.image_url && (
                  <img src={selectedPoster.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded border" />
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-trending"
                    checked={selectedPoster.is_trending || false}
                    onCheckedChange={(checked) => setSelectedPoster({ ...selectedPoster, is_trending: checked })}
                  />
                  <Label htmlFor="edit-trending">Trending</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-bestseller"
                    checked={selectedPoster.is_best_seller || false}
                    onCheckedChange={(checked) => setSelectedPoster({ ...selectedPoster, is_best_seller: checked })}
                  />
                  <Label htmlFor="edit-bestseller">Best Seller</Label>
                </div>
              </div>

              <Button 
                onClick={handleUpdatePoster}
                disabled={updatePosterMutation.isPending}
              >
                {updatePosterMutation.isPending ? 'Updating...' : 'Update Poster'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PosterManagement;
