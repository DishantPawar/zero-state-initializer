
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '../components/Navigation';
import { Upload, FileSpreadsheet, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateIngredient } from '@/hooks/useIngredients';
import * as XLSX from 'xlsx';

const IngredientImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const createIngredient = useCreateIngredient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to import",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        console.log('Imported ingredients:', jsonData);
        
        let successCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
          try {
            const ingredientData = {
              name: row.Name || row.name || '',
              category: (row.Category || row.category || 'Other') as any,
              e_number: row['E Number'] || row.e_number || null,
              other_ingredient: row['Other Ingredient'] || row.other_ingredient || null,
              allergens: row.Allergens ? 
                (typeof row.Allergens === 'string' ? row.Allergens.split(',').map((a: string) => a.trim()) : []) : 
                []
            };

            if (ingredientData.name) {
              await new Promise((resolve, reject) => {
                createIngredient.mutate(ingredientData, {
                  onSuccess: resolve,
                  onError: reject
                });
              });
              successCount++;
            }
          } catch (error) {
            console.error('Failed to import ingredient:', row, error);
            errorCount++;
          }
        }
        
        toast({
          title: "Import completed",
          description: `Successfully imported ${successCount} ingredients${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
        
        if (successCount > 0) {
          navigate('/ingredients');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import the Excel file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/ingredients')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Ingredients</h1>
          <p className="text-gray-600">Upload an Excel file to import ingredients in bulk</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Excel File
            </CardTitle>
            <CardDescription>
              Select an Excel file (.xlsx or .xls) containing ingredient data to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <p className="text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Excel Format Requirements:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• First row should contain column headers</li>
                <li>• Required columns: Name, Category</li>
                <li>• Optional columns: E Number, Other Ingredient, Allergens (comma-separated)</li>
                <li>• Category should be one of: Preservative, Antioxidant, Colorant, Flavoring, Stabilizer, Emulsifier, Acidifier, Fining Agent, Other</li>
                <li>• Save the file as .xlsx or .xls format</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleImport}
              disabled={!file || isUploading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? 'Importing...' : 'Import Ingredients'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngredientImport;
