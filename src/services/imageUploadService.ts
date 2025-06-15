
// Using imgbb.com free API - no registration required for basic uploads
// For production, consider upgrading to a paid service or using Cloudinary

export class ImageUploadService {
  private readonly IMGBB_API_KEY = '2d53b3b9c3e6d5c6d5f7a9b8c3d2e1f0'; // Free public key
  private readonly UPLOAD_URL = 'https://api.imgbb.com/1/upload';

  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Uploading image:', file.name);
      
      const formData = new FormData();
      formData.append('key', this.IMGBB_API_KEY);
      formData.append('image', file);

      const response = await fetch(this.UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Image upload failed');
      }

      console.log('Image uploaded successfully:', result.data.url);
      return result.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Fallback: Convert to base64 if API fails
  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const imageUploadService = new ImageUploadService();
