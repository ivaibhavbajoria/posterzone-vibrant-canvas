
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Upload } from 'lucide-react';
import { toast } from "sonner";
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { localStorageService, LocalPoster, LocalCategory } from '@/services/localStorageService';
import { imageUploadService } from '@/services/imageUploadService';

interface PosterFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  is_trending: boolean;
  is_best_seller: boolean;
  image_url: string;
  image: File | null;
}

const PosterManagement = () => {
  const { isAdminLoggedIn } = useAdminAuth();
  const [posters, setPosters] = useState<LocalPoster[]>([]);
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<LocalPoster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PosterFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    is_trending: false,
    is_best_seller: false,
    image_url: '',
    image: null
  });

  // Load data from localStorage
  const loadData = () => {
    try {
      console.log('Loading data from localStorage...');
      localStorageService.initializeData();
      const loadedPosters = localStorageService.getPosters();
      const loadedCategories = localStorageService.getCategories();
      
      console.log('Loaded posters:', loadedPosters);
      console.log('Loaded categories:', loadedCategories);
      
      setPosters(loadedPosters);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      toast.error('Admin authentication required');
      return;
    }
    loadData();
  }, [isAdminLoggedIn]);

  const handleInputChange = (field: keyof PosterFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image selected:', file.name, file.size);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Starting form submission with data:', formData);
    
    if (!isAdminLoggedIn) {
      toast.error('Admin authentication required');
      return;
    }
    
    if (!formData.title || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // If using image URL directly (backend integration)
    if (formData.image_url && !formData.image) {
      const posterData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_trending: formData.is_trending,
        is_best_seller: formData.is_best_seller,
        image_url: formData.image_url
      };

      try {
        if (editingPoster) {
          localStorageService.updatePoster(editingPoster.id, posterData);
          toast.success('Poster updated successfully');
        } else {
          localStorageService.addPoster(posterData);
          toast.success('Poster added successfully');
        }
        resetFormAndClose();
        loadData();
      } catch (error) {
        console.error('Error saving poster:', error);
        toast.error('Failed to save poster');
      }
      return;
    }

    // Handle file upload (for preview/testing purposes)
    if (formData.image) {
      setIsLoading(true);
      try {
        console.log('Processing image for preview...');
        const imageUrl = await imageUploadService.uploadImage(formData.image);

        const posterData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          is_trending: formData.is_trending,
          is_best_seller: formData.is_best_seller,
          image_url: imageUrl
        };

        console.log('Saving poster data:', posterData);

        if (editingPoster) {
          console.log('Updating existing poster with ID:', editingPoster.id);
          const updatedPoster = localStorageService.updatePoster(editingPoster.id, posterData);
          if (!updatedPoster) {
            throw new Error('Failed to update poster');
          }
          toast.success('Poster updated successfully');
        } else {
          console.log('Creating new poster...');
          localStorageService.addPoster(posterData);
          toast.success('Poster added successfully');
        }

        resetFormAndClose();
        loadData();
      } catch (error) {
        console.error('Error saving poster:', error);
        toast.error(`Failed to save poster: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please provide either an image URL or upload an image file');
    }
  };

  const handleEdit = (poster: LocalPoster) => {
    console.log('Editing poster:', poster);
    setEditingPoster(poster);
    setFormData({
      title: poster.title,
      description: poster.description,
      price: poster.price.toString(),
      category: poster.category,
      is_trending: poster.is_trending,
      is_best_seller: poster.is_best_seller,
      image_url: poster.image_url,
      image: null
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;

    try {
      console.log('Deleting poster with ID:', id);
      const success = localStorageService.deletePoster(id);
      
      if (!success) {
        throw new Error('Poster not found');
      }
      
      toast.success('Poster deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting poster:', error);
      toast.error('Failed to delete poster');
    }
  };

  const resetFormAndClose = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      is_trending: false,
      is_best_seller: false,
      image_url: '',
      image: null
    });
    setEditingPoster(null);
    setIsAddDialogOpen(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>Admin authentication required to manage posters</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Poster Management</CardTitle>
            <CardDescription>Manage your poster inventory (Local storage + Cloud images)</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetFormAndClose();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Poster
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPoster ? 'Edit Poster' : 'Add New Poster'}
                </DialogTitle>
                <DialogDescription>
                  {editingPoster ? 'Update poster details' : 'Fill in the details to add a new poster. Provide either an image URL (recommended for backend integration) or upload a file.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter poster title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter poster description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
                  <Label htmlFor="image_url">Image URL (Recommended)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://your-cloud-storage.com/image.jpg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Provide the direct URL from your cloud storage (Google Cloud, AWS S3, Cloudinary, etc.)
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <Label htmlFor="image">Or Upload Image File (For Testing)</Label>
                  <div className="mt-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {formData.image && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {formData.image.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Note: File uploads are for testing only. Use image URLs for production.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="trending"
                      checked={formData.is_trending}
                      onCheckedChange={(checked) => handleInputChange('is_trending', checked)}
                    />
                    <Label htmlFor="trending">Mark as Trending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bestseller"
                      checked={formData.is_best_seller}
                      onCheckedChange={(checked) => handleInputChange('is_best_seller', checked)}
                    />
                    <Label htmlFor="bestseller">Mark as Best Seller</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingPoster ? 'Update' : 'Add'} Poster
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posters.map((poster) => (
              <TableRow key={poster.id}>
                <TableCell>
                  <img
                    src={poster.image_url || '/placeholder.svg'}
                    alt={poster.title}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{poster.title}</TableCell>
                <TableCell>{poster.category}</TableCell>
                <TableCell>₹{poster.price}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {poster.is_trending && <Badge variant="destructive">Trending</Badge>}
                    {poster.is_best_seller && <Badge variant="default">Best Seller</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(poster)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(poster.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {posters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No posters found</p>
            <p>Add your first poster using cloud storage URLs or upload files for testing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PosterManagement;
