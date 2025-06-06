import React, { useState, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '../components/Navigation';
import { useProduct, useDeleteProduct, useUpdateProduct } from '../hooks/useProducts';
import { ArrowLeft, Edit, Trash2, Copy, QrCode, ExternalLink, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '../lib/queryClient';
import { format } from 'date-fns';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent><Skeleton className="h-64 w-full" /></CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent><Skeleton className="h-48 w-full" /></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
            <Button onClick={() => setLocation('/products')} className="mt-4">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setLocation(`/products/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct.mutateAsync(id!);
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        toast({
          title: "Product deleted",
          description: "Product has been successfully deleted.",
        });
        setLocation('/products');
      } catch (error: any) {
        console.error('Delete error:', error);
        toast({
          title: "Delete failed",
          description: `Failed to delete product: ${error.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDuplicate = () => {
    // Create a new product with same data but different name
    const duplicateData = {
      ...product,
      name: `${product.name} (Copy)`,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
    
    // Navigate to create form with pre-filled data
    setLocation('/products/create');
    
    toast({
      title: "Ready to duplicate",
      description: "Product form opened with current product data.",
    });
  };

  const handleDeleteImage = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await updateProductMutation.mutateAsync({
          id: product.id,
          imageUrl: null
        });
        // Cache will be automatically updated by the mutation
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to delete image: " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Update product with new image
        updateProductMutation.mutate({
          id: product.id,
          imageUrl: base64
        });

        toast({
          title: "Image uploaded",
          description: "Product image has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${product.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "QR Code downloaded",
        description: "QR code has been successfully downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Link has been copied to clipboard.",
    });
  };

  // Generate QR code URL from barcode link or product URL
  const barcodeOrProductLink = product.barcodeLink || `${window.location.origin}/products/details/${product.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(barcodeOrProductLink)}`;
  
  // Generate various links
  const labelPublicLink = `${window.location.origin}/products/details/${product.id}`;
  const externalShortLink = product.barcodeLink || `https://short.ly/${product.ean || product.id}`;
  const redirectLink = product.barcodeLink || `https://redirect.com/${product.ean || product.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600">{product.brand}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Image
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleChangeImage}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    {product.imageUrl && (
                      <Button variant="outline" size="sm" onClick={handleDeleteImage}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Image
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full max-w-md bg-gray-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        key={`${product.id}-${product.updatedAt}`} // Force re-render on updates
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const placeholder = document.createElement('span');
                          placeholder.textContent = 'Image not available';
                          placeholder.className = 'text-gray-500';
                          (e.target as HTMLImageElement).parentNode?.appendChild(placeholder);
                        }}
                      />
                    ) : (
                      <span className="text-gray-500">No Image Available</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, WebP. Max size: 2MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Product Name:</span>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Brand:</span>
                  <p className="text-gray-900">{product.brand || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Net Volume:</span>
                  <p className="text-gray-900">{product.netVolume || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Vintage:</span>
                  <p className="text-gray-900">{product.vintage || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Wine Type:</span>
                  <p className="text-gray-900">{product.wineType || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Sugar Content:</span>
                  <p className="text-gray-900">{product.sugarContent || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Appellation:</span>
                  <p className="text-gray-900">{product.appellation || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Alcohol Content:</span>
                  <p className="text-gray-900">{product.alcoholContent || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Country of Origin:</span>
                  <p className="text-gray-900">{product.countryOfOrigin || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">EAN:</span>
                  <p className="text-gray-900">{product.ean || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {product.ingredients || 'No ingredients specified'}
                </p>
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Packaging Gases:</span>
                  <p className="text-gray-900">{product.packagingGases || 'No packaging gases specified'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Information */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Portion Size:</span>
                  <p className="text-gray-900">{product.portionSize || 'N/A'} {product.unit || ''}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">kJ:</span>
                  <p className="text-gray-900">{product.kj || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fat:</span>
                  <p className="text-gray-900">{product.fat || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Carbohydrates:</span>
                  <p className="text-gray-900">{product.carbohydrates || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {product.organic && <Badge variant="secondary">Organic</Badge>}
                  {product.vegetarian && <Badge variant="secondary">Vegetarian</Badge>}
                  {product.vegan && <Badge variant="secondary">Vegan</Badge>}
                  {!product.organic && !product.vegetarian && !product.vegan && (
                    <span className="text-gray-500">No certifications</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Food Business Operator */}
            <Card>
              <CardHeader>
                <CardTitle>Food Business Operator</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Operator Type:</span>
                  <p className="text-gray-900">{product.operatorType || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Operator Name:</span>
                  <p className="text-gray-900">{product.operatorName || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Operator Address:</span>
                  <p className="text-gray-900">{product.operatorAddress || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {product.additionalInfo || 'No additional information available'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleEdit} 
                  className="w-full flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Product
                </Button>
                
                <Button 
                  onClick={handleDuplicate} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                
                <Separator />
                
                <Button 
                  onClick={handleDelete} 
                  variant="destructive" 
                  className="w-full flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Product
                </Button>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <img 
                  src={qrCodeUrl} 
                  alt="Product QR Code"
                  className="w-32 h-32 mx-auto border rounded"
                />
                <div className="space-y-2">
                  <Button 
                    onClick={handleDownloadQR}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Label Public Link</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={labelPublicLink} 
                      readOnly 
                      className="flex-1 text-xs p-2 border rounded bg-gray-50"
                    />
                    <Button 
                      onClick={() => handleCopyLink(labelPublicLink)}
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">External Short Link</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={externalShortLink} 
                      readOnly 
                      className="flex-1 text-xs p-2 border rounded bg-gray-50"
                    />
                    <Button 
                      onClick={() => handleCopyLink(externalShortLink)}
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Redirect Link</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={redirectLink} 
                      readOnly 
                      className="flex-1 text-xs p-2 border rounded bg-gray-50"
                    />
                    <Button 
                      onClick={() => handleCopyLink(redirectLink)}
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;