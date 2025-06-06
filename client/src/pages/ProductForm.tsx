import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '../components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const { data: existingProduct, isLoading: productLoading } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    netVolume: '',
    vintage: null as number | null,
    type: '',
    sugarContent: '',
    appellation: '',
    sku: '',
    barcode: '',
    qrCode: '',
    alcoholContent: '',
    productionDate: '',
    expiryDate: '',
    description: '',
    producer: '',
    region: '',
    grapeVarieties: [] as string[],
    servingTemperatureMin: null as number | null,
    servingTemperatureMax: null as number | null,
    storageInstructions: ''
  });

  useEffect(() => {
    if (existingProduct && isEdit) {
      setFormData({
        name: existingProduct.name || '',
        brand: existingProduct.brand || '',
        netVolume: existingProduct.netVolume || '',
        vintage: existingProduct.vintage,
        type: existingProduct.type || '',
        sugarContent: existingProduct.sugarContent || '',
        appellation: existingProduct.appellation || '',
        sku: existingProduct.sku || '',
        barcode: existingProduct.barcode || '',
        qrCode: existingProduct.qrCode || '',
        alcoholContent: existingProduct.alcoholContent ? String(existingProduct.alcoholContent) : '',
        productionDate: existingProduct.productionDate || '',
        expiryDate: existingProduct.expiryDate || '',
        description: existingProduct.description || '',
        producer: existingProduct.producer || '',
        region: existingProduct.region || '',
        grapeVarieties: existingProduct.grapeVarieties || [],
        servingTemperatureMin: existingProduct.servingTemperatureMin,
        servingTemperatureMax: existingProduct.servingTemperatureMax,
        storageInstructions: existingProduct.storageInstructions || ''
      });
    }
  }, [existingProduct, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.type) {
      toast({
        title: "Validation Error", 
        description: "Wine type is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.sugarContent) {
      toast({
        title: "Validation Error",
        description: "Sugar content is required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const submitData = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || null,
        netVolume: formData.netVolume.trim() || null,
        vintage: formData.vintage,
        type: formData.type,
        sugarContent: formData.sugarContent,
        appellation: formData.appellation.trim() || null,
        sku: formData.sku.trim() || null,
        barcode: formData.barcode.trim() || null,
        qrCode: formData.qrCode.trim() || null,
        alcoholContent: formData.alcoholContent ? formData.alcoholContent : null,
        productionDate: formData.productionDate || null,
        expiryDate: formData.expiryDate || null,
        description: formData.description.trim() || null,
        producer: formData.producer.trim() || null,
        region: formData.region.trim() || null,
        grapeVarieties: formData.grapeVarieties.length > 0 ? formData.grapeVarieties : null,
        servingTemperatureMin: formData.servingTemperatureMin,
        servingTemperatureMax: formData.servingTemperatureMax,
        storageInstructions: formData.storageInstructions.trim() || null,
      };

      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, ...submitData });
        toast({
          title: "Product updated",
          description: `Product ${formData.name} has been successfully updated.`,
        });
      } else {
        await createProduct.mutateAsync(submitData);
        toast({
          title: "Product created",
          description: `Product ${formData.name} has been successfully created.`,
        });
      }
      
      setLocation('/products');
    } catch (error) {
      console.error('Product save error:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please check all required fields.",
        variant: "destructive"
      });
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update product information' : 'Add a new wine product to your inventory'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netVolume">Net Volume</Label>
                <Input
                  id="netVolume"
                  name="netVolume"
                  value={formData.netVolume}
                  onChange={handleInputChange}
                  placeholder="e.g., 750ml"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., WN-001"
                />
              </div>
            </CardContent>
          </Card>

          {/* Wine Details */}
          <Card>
            <CardHeader>
              <CardTitle>Wine Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vintage">Vintage</Label>
                <Input
                  id="vintage"
                  name="vintage"
                  type="number"
                  value={formData.vintage || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vintage: e.target.value ? Number(e.target.value) : null 
                  }))}
                  placeholder="e.g., 2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Wine Type *</Label>
                <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Rosé">Rosé</SelectItem>
                    <SelectItem value="Sparkling">Sparkling</SelectItem>
                    <SelectItem value="Dessert">Dessert</SelectItem>
                    <SelectItem value="Fortified">Fortified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugarContent">Sugar Content *</Label>
                <Select onValueChange={(value) => handleSelectChange('sugarContent', value)} value={formData.sugarContent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sugar content" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dry">Dry</SelectItem>
                    <SelectItem value="Semi-Dry">Semi-Dry</SelectItem>
                    <SelectItem value="Semi-Sweet">Semi-Sweet</SelectItem>
                    <SelectItem value="Sweet">Sweet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcoholContent">Alcohol Content (%)</Label>
                <Input
                  id="alcoholContent"
                  name="alcoholContent"
                  type="number"
                  step="0.1"
                  value={formData.alcoholContent}
                  onChange={handleInputChange}
                  placeholder="e.g., 13.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appellation">Appellation</Label>
                <Input
                  id="appellation"
                  name="appellation"
                  value={formData.appellation}
                  onChange={handleInputChange}
                  placeholder="e.g., Bordeaux AOC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producer">Producer</Label>
                <Input
                  id="producer"
                  name="producer"
                  value={formData.producer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qrCode">QR Code</Label>
                <Input
                  id="qrCode"
                  name="qrCode"
                  value={formData.qrCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productionDate">Production Date</Label>
                <Input
                  id="productionDate"
                  name="productionDate"
                  type="date"
                  value={formData.productionDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servingTemperatureMin">Min Serving Temperature (°C)</Label>
                <Input
                  id="servingTemperatureMin"
                  name="servingTemperatureMin"
                  type="number"
                  value={formData.servingTemperatureMin || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    servingTemperatureMin: e.target.value ? Number(e.target.value) : null 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servingTemperatureMax">Max Serving Temperature (°C)</Label>
                <Input
                  id="servingTemperatureMax"
                  name="servingTemperatureMax"
                  type="number"
                  value={formData.servingTemperatureMax || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    servingTemperatureMax: e.target.value ? Number(e.target.value) : null 
                  }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="storageInstructions">Storage Instructions</Label>
                <Textarea
                  id="storageInstructions"
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation('/products')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {createProduct.isPending || updateProduct.isPending 
                ? 'Saving...' 
                : isEdit ? 'Update Product' : 'Create Product'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;