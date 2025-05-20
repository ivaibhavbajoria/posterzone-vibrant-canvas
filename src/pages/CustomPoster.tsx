
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomPoster = () => {
  const { toast } = useToast();
  
  const [posterDetails, setPosterDetails] = useState({
    title: "",
    size: "18x24",
    frame: "none",
    quantity: 1,
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPosterDetails({
      ...posterDetails,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setPosterDetails({
      ...posterDetails,
      [name]: value,
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image for your custom poster",
        variant: "destructive",
      });
      return;
    }
    
    if (!posterDetails.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your custom poster",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Custom poster created!",
        description: "Your poster has been added to cart.",
      });
    }, 2000);
  };
  
  const clearUpload = () => {
    setUploadedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="min-h-screen bg-posterzone-lightgray py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-posterzone-charcoal mb-2">Create Custom Poster</h1>
          <p className="text-gray-600 mb-8">Upload your own image to create a personalized poster</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Section */}
            <div className="order-2 lg:order-1">
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full max-h-[400px] mx-auto object-contain rounded-md"
                      />
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearUpload}
                          className="text-posterzone-charcoal"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg w-full min-h-[400px] flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700">Upload Your Image</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">
                        Drag and drop your image here, or click to browse files
                      </p>
                      <input 
                        type="file" 
                        id="poster-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button
                        onClick={() => document.getElementById('poster-upload')?.click()}
                        variant="outline"
                        className="mt-4"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Details Form */}
            <div className="order-1 lg:order-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Poster Title
                        </label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., My Summer Adventure"
                          value={posterDetails.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                          Poster Size
                        </label>
                        <Select 
                          value={posterDetails.size} 
                          onValueChange={(value) => handleSelectChange("size", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11x17">11" x 17" - Small ($19.99)</SelectItem>
                            <SelectItem value="18x24">18" x 24" - Medium ($29.99)</SelectItem>
                            <SelectItem value="24x36">24" x 36" - Large ($39.99)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor="frame" className="block text-sm font-medium text-gray-700 mb-1">
                          Frame Option
                        </label>
                        <Select 
                          value={posterDetails.frame} 
                          onValueChange={(value) => handleSelectChange("frame", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frame" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Frame</SelectItem>
                            <SelectItem value="black">Black Frame (+$15.00)</SelectItem>
                            <SelectItem value="white">White Frame (+$15.00)</SelectItem>
                            <SelectItem value="natural">Natural Wood Frame (+$25.00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <Select 
                          value={posterDetails.quantity.toString()} 
                          onValueChange={(value) => handleSelectChange("quantity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-posterzone-orange hover:bg-posterzone-orange/90"
                          disabled={isUploading || !uploadedFile}
                        >
                          {isUploading ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Additional Info */}
              <div className="mt-6 bg-white p-6 rounded-md shadow-sm">
                <h3 className="text-lg font-medium text-posterzone-charcoal mb-3">
                  Custom Poster Details
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-posterzone-blue mr-2 shrink-0" />
                    <span>Premium quality printing on 200 GSM semi-gloss paper</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-posterzone-blue mr-2 shrink-0" />
                    <span>Vibrant colors that resist fading for years</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-posterzone-blue mr-2 shrink-0" />
                    <span>Ships within 3-5 business days</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-posterzone-blue mr-2 shrink-0" />
                    <span>100% satisfaction guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomPoster;
