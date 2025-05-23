
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Search, Filter, Edit, MoreVertical, Plus, ImagePlus, 
  Trash2, Eye, Tag, CheckCircle, XCircle, Upload
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Mock data for posters
const mockPosters = [
  {
    id: 'PST-001',
    title: 'Abstract Geometry Lines',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52a',
    category: 'Abstract',
    price: 34.99,
    stock: 45,
    status: 'active',
    isBestSeller: true,
    isTrending: true,
  },
  {
    id: 'PST-002',
    title: 'Minimalist Nature',
    image: 'https://images.unsplash.com/photo-1493382051629-7eb03ec93ea2',
    category: 'Nature',
    price: 29.99,
    stock: 32,
    status: 'active',
    isBestSeller: true,
    isTrending: false,
  },
  {
    id: 'PST-003',
    title: 'Vintage Cinema Poster',
    image: 'https://images.unsplash.com/photo-1536440136630-a8c3a9f3aee7',
    category: 'Vintage',
    price: 39.99,
    stock: 18,
    status: 'active',
    isBestSeller: true,
    isTrending: true,
  },
  {
    id: 'PST-004',
    title: 'Urban Cityscape',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    category: 'Urban',
    price: 32.99,
    stock: 27,
    status: 'active',
    isBestSeller: false,
    isTrending: true,
  },
  {
    id: 'PST-005',
    title: 'Mountain Ranges',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    category: 'Nature',
    price: 27.99,
    stock: 5,
    status: 'low_stock',
    isBestSeller: false,
    isTrending: false,
  },
  {
    id: 'PST-006',
    title: 'Retro Gaming',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    category: 'Retro',
    price: 36.99,
    stock: 0,
    status: 'out_of_stock',
    isBestSeller: false,
    isTrending: false,
  }
];

const mockCategories = [
  'Abstract', 'Nature', 'Vintage', 'Urban', 'Retro', 'Minimalist', 'Photography', 'Art', 'Movie', 'Music'
];

const PosterManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posters, setPosters] = useState(mockPosters);
  
  const [isAddPosterOpen, setIsAddPosterOpen] = useState(false);
  const [isEditPosterOpen, setIsEditPosterOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  
  const [newPoster, setNewPoster] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    isBestSeller: false,
    isTrending: false
  });

  // Filter posters based on search and filters
  const filteredPosters = posters.filter(poster => {
    const matchesSearch = poster.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       poster.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || poster.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || poster.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle adding a new poster
  const handleAddPoster = () => {
    const posterWithId = {
      ...newPoster,
      id: `PST-${String(posters.length + 1).padStart(3, '0')}`,
      status: parseInt(newPoster.stock) > 0 ? (parseInt(newPoster.stock) <= 5 ? 'low_stock' : 'active') : 'out_of_stock',
      price: parseFloat(newPoster.price)
    };
    
    setPosters([...posters, posterWithId]);
    setIsAddPosterOpen(false);
    setNewPoster({
      title: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      isBestSeller: false,
      isTrending: false
    });
    
    toast({
      title: "Poster Added",
      description: `${posterWithId.title} has been added successfully.`,
    });
  };

  // Handle updating a poster
  const handleUpdatePoster = () => {
    const updatedPosters = posters.map(poster => 
      poster.id === selectedPoster.id ? selectedPoster : poster
    );
    
    setPosters(updatedPosters);
    setIsEditPosterOpen(false);
    setSelectedPoster(null);
    
    toast({
      title: "Poster Updated",
      description: `${selectedPoster.title} has been updated successfully.`,
    });
  };

  // Handle deleting a poster
  const handleDeletePoster = (posterId) => {
    const updatedPosters = posters.filter(poster => poster.id !== posterId);
    setPosters(updatedPosters);
    
    toast({
      title: "Poster Deleted",
      description: "The poster has been removed successfully.",
      variant: "destructive"
    });
  };

  // Handle toggling best seller status
  const toggleBestSeller = (posterId) => {
    const updatedPosters = posters.map(poster => {
      if (poster.id === posterId) {
        return { ...poster, isBestSeller: !poster.isBestSeller };
      }
      return poster;
    });
    
    setPosters(updatedPosters);
    
    const poster = posters.find(p => p.id === posterId);
    toast({
      title: poster.isBestSeller ? "Removed from Best Sellers" : "Added to Best Sellers",
      description: `${poster.title} has been ${poster.isBestSeller ? 'removed from' : 'added to'} Best Sellers.`,
    });
  };

  // Handle toggling trending status
  const toggleTrending = (posterId) => {
    const updatedPosters = posters.map(poster => {
      if (poster.id === posterId) {
        return { ...poster, isTrending: !poster.isTrending };
      }
      return poster;
    });
    
    setPosters(updatedPosters);
    
    const poster = posters.find(p => p.id === posterId);
    toast({
      title: poster.isTrending ? "Removed from Trending" : "Added to Trending",
      description: `${poster.title} has been ${poster.isTrending ? 'removed from' : 'added to'} Trending.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold">Poster Management</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search posters..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>All Categories</DropdownMenuItem>
                {mockCategories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>In Stock</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('low_stock')}>Low Stock</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('out_of_stock')}>Out of Stock</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddPosterOpen} onOpenChange={setIsAddPosterOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Poster
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Poster</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new poster. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Poster Title</Label>
                      <Input 
                        id="title" 
                        value={newPoster.title}
                        onChange={(e) => setNewPoster({...newPoster, title: e.target.value})}
                        placeholder="Enter poster title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        onValueChange={(value) => setNewPoster({...newPoster, category: value})}
                        value={newPoster.category}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {mockCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        type="number"
                        step="0.01"
                        value={newPoster.price}
                        onChange={(e) => setNewPoster({...newPoster, price: e.target.value})}
                        placeholder="29.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input 
                        id="stock" 
                        type="number"
                        value={newPoster.stock}
                        onChange={(e) => setNewPoster({...newPoster, stock: e.target.value})}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                      id="image" 
                      value={newPoster.image}
                      onChange={(e) => setNewPoster({...newPoster, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newPoster.description}
                      onChange={(e) => setNewPoster({...newPoster, description: e.target.value})}
                      placeholder="Enter poster description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="best-seller"
                        checked={newPoster.isBestSeller}
                        onCheckedChange={(checked) => setNewPoster({...newPoster, isBestSeller: checked})}
                      />
                      <Label htmlFor="best-seller">Best Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="trending"
                        checked={newPoster.isTrending}
                        onCheckedChange={(checked) => setNewPoster({...newPoster, isTrending: checked})}
                      />
                      <Label htmlFor="trending">Trending</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPosterOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPoster}>Save Poster</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>List of all available posters</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosters.length > 0 ? (
                filteredPosters.map((poster) => (
                  <TableRow key={poster.id}>
                    <TableCell>
                      <img 
                        src={poster.image} 
                        alt={poster.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p>{poster.title}</p>
                        <p className="text-xs text-gray-500">{poster.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{poster.category}</TableCell>
                    <TableCell>${poster.price.toFixed(2)}</TableCell>
                    <TableCell>{poster.stock}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          poster.status === 'active' ? 'bg-green-100 text-green-800' :
                          poster.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {poster.status === 'active' ? 'In Stock' :
                         poster.status === 'low_stock' ? 'Low Stock' :
                         'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {poster.isBestSeller && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            Best Seller
                          </Badge>
                        )}
                        {poster.isTrending && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedPoster(poster);
                              setIsEditPosterOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Poster
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleBestSeller(poster.id)}>
                              <Tag className="mr-2 h-4 w-4" /> 
                              {poster.isBestSeller ? 'Remove Best Seller' : 'Mark as Best Seller'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleTrending(poster.id)}>
                              <Tag className="mr-2 h-4 w-4" /> 
                              {poster.isTrending ? 'Remove Trending' : 'Mark as Trending'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeletePoster(poster.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Poster
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No posters found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Quick actions cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Bulk Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop a CSV file or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Stock Alert Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
              <Switch id="low-stock-alerts" defaultChecked />
            </div>
            <div>
              <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
              <div className="flex items-center mt-1">
                <Input id="low-stock-threshold" type="number" defaultValue="5" className="w-20" />
                <span className="ml-2 text-sm text-gray-500">items</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Poster Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <Plus className="h-3 w-3 mr-1" /> Add Category
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Poster Dialog */}
      <Dialog open={isEditPosterOpen} onOpenChange={setIsEditPosterOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedPoster && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Poster</DialogTitle>
                <DialogDescription>
                  Update the details for {selectedPoster.title}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Poster Title</Label>
                    <Input 
                      id="edit-title" 
                      value={selectedPoster.title}
                      onChange={(e) => setSelectedPoster({...selectedPoster, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={selectedPoster.category}
                      onValueChange={(value) => setSelectedPoster({...selectedPoster, category: value})}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {mockCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input 
                      id="edit-price" 
                      type="number"
                      step="0.01"
                      value={selectedPoster.price}
                      onChange={(e) => setSelectedPoster({...selectedPoster, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stock Quantity</Label>
                    <Input 
                      id="edit-stock" 
                      type="number"
                      value={selectedPoster.stock}
                      onChange={(e) => {
                        const stockValue = parseInt(e.target.value);
                        let status = 'active';
                        if (stockValue <= 0) status = 'out_of_stock';
                        else if (stockValue <= 5) status = 'low_stock';
                        
                        setSelectedPoster({
                          ...selectedPoster, 
                          stock: stockValue,
                          status: status
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input 
                    id="edit-image" 
                    value={selectedPoster.image}
                    onChange={(e) => setSelectedPoster({...selectedPoster, image: e.target.value})}
                  />
                  {selectedPoster.image && (
                    <div className="mt-2">
                      <img 
                        src={selectedPoster.image} 
                        alt={selectedPoster.title} 
                        className="h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-best-seller"
                      checked={selectedPoster.isBestSeller}
                      onCheckedChange={(checked) => setSelectedPoster({...selectedPoster, isBestSeller: checked})}
                    />
                    <Label htmlFor="edit-best-seller">Best Seller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-trending"
                      checked={selectedPoster.isTrending}
                      onCheckedChange={(checked) => setSelectedPoster({...selectedPoster, isTrending: checked})}
                    />
                    <Label htmlFor="edit-trending">Trending</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditPosterOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdatePoster}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PosterManagement;
