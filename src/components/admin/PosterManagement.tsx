
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
import { Trash2, Edit, Plus, Upload, Eye } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

// Type definitions
interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Poster {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_trending: boolean;
  is_best_seller: boolean;
  created_at: string;
}

interface PosterFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  is_trending: boolean;
  is_best_seller: boolean;
  image: File | null;
}

const PosterManagement = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PosterFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    is_trending: false,
    is_best_seller: false,
    image: null
  });

  // Fetch posters
  const fetchPosters = async () => {
    try {
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      setPosters(data as Poster[]);
    } catch (error) {
      console.error('Error fetching posters:', error);
      toast.error('Failed to fetch posters');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw new Error(error.message);
      setCategories(data as Category[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchPosters();
    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof PosterFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `poster-${Date.now()}.${fileExt}`;
    const filePath = `posters/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('posters')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('posters')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = editingPoster?.image_url || '';
      
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const posterData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_trending: formData.is_trending,
        is_best_seller: formData.is_best_seller,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      };

      if (editingPoster) {
        const { error } = await supabase
          .from('posters')
          .update(posterData)
          .eq('id', editingPoster.id);
        
        if (error) throw error;
        toast.success('Poster updated successfully');
      } else {
        const { error } = await supabase
          .from('posters')
          .insert([posterData]);
        
        if (error) throw error;
        toast.success('Poster added successfully');
      }

      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        is_trending: false,
        is_best_seller: false,
        image: null
      });
      setIsAddDialogOpen(false);
      setEditingPoster(null);
      fetchPosters();
    } catch (error) {
      console.error('Error saving poster:', error);
      toast.error('Failed to save poster');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (poster: Poster) => {
    setEditingPoster(poster);
    setFormData({
      title: poster.title,
      description: poster.description,
      price: poster.price.toString(),
      category: poster.category,
      is_trending: poster.is_trending,
      is_best_seller: poster.is_best_seller,
      image: null
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;

    try {
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Poster deleted successfully');
      fetchPosters();
    } catch (error) {
      console.error('Error deleting poster:', error);
      toast.error('Failed to delete poster');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      is_trending: false,
      is_best_seller: false,
      image: null
    });
    setEditingPoster(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Poster Management</CardTitle>
            <CardDescription>Manage your poster inventory</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
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
                  {editingPoster ? 'Update poster details' : 'Fill in the details to add a new poster'}
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
                  <Label htmlFor="image">Poster Image</Label>
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
            No posters found. Add your first poster to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PosterManagement;
