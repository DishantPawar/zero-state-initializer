import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navigation from '../components/Navigation';
import ProductPreviewDialog from '../components/ProductPreviewDialog';
import { Plus, Search, Download, Upload, MoreHorizontal, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import type { Product } from '@shared/schema';

const ProductList: React.FC = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.ean && product.ean.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (id: string) => {
    setLocation(`/products/edit/${id}`);
  };

  const handleDetails = (id: string) => {
    setLocation(`/products/details/${id}`);
  };

  const handlePreview = (product: Product) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = (product: Product) => {
    // Navigate to create form with pre-filled data
    setLocation(`/products/create?duplicate=${product.id}`);
  };

  const handleImport = () => {
    setLocation('/products/import');
  };

  const handleExport = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
        Name: product.name,
        Brand: product.brand,
        'Net Volume': product.netVolume,
        Vintage: product.vintage,
        'Wine Type': product.wineType,
        'Sugar Content': product.sugarContent,
        Appellation: product.appellation,
        EAN: product.ean
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
      
      XLSX.writeFile(workbook, 'products.xlsx');
      
      toast({
        title: "Export successful",
        description: "Products exported to Excel file",
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory and details</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setLocation('/products/create')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Net Volume</TableHead>
                  <TableHead>Vintage</TableHead>
                  <TableHead>Wine Type</TableHead>
                  <TableHead>Sugar Content</TableHead>
                  <TableHead>Appellation</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.netVolume}</TableCell>
                    <TableCell>{product.vintage}</TableCell>
                    <TableCell>{product.wineType}</TableCell>
                    <TableCell>{product.sugarContent}</TableCell>
                    <TableCell>{product.appellation}</TableCell>
                    <TableCell>{product.ean}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product.id)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDetails(product.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePreview(product)}>
                              Preview
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ProductPreviewDialog 
        product={previewProduct}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default ProductList;
