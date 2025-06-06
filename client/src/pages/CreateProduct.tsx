import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { useCreateProduct, useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Edit3 } from "lucide-react";
import { useEffect } from "react";

export default function CreateProduct() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const createProduct = useCreateProduct();
  
  // Check if we're duplicating a product
  const urlParams = new URLSearchParams(window.location.search);
  const duplicateId = urlParams.get('duplicate');
  const { data: productToDuplicate } = useProduct(duplicateId || undefined);

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      netVolume: "",
      vintage: "",
      wineType: "",
      sugarContent: "",
      appellation: "",
      alcoholContent: "",
      packagingGases: "",
      portionSize: "",
      unit: "",
      kj: "",
      fat: "",
      carbohydrates: "",
      organic: false,
      vegetarian: false,
      vegan: false,
      operatorType: "",
      operatorName: "",
      operatorAddress: "",
      additionalInformation: "",
      countryOfOrigin: "",
      ean: "",
      barcodeLink: "",
    },
  });

  // Pre-fill form when duplicating a product
  useEffect(() => {
    if (productToDuplicate) {
      form.reset({
        name: `${productToDuplicate.name} (Copy)`,
        brand: productToDuplicate.brand || "",
        netVolume: productToDuplicate.netVolume || "",
        vintage: productToDuplicate.vintage || "",
        wineType: productToDuplicate.wineType || "",
        sugarContent: productToDuplicate.sugarContent || "",
        appellation: productToDuplicate.appellation || "",
        alcoholContent: productToDuplicate.alcoholContent || "",
        packagingGases: productToDuplicate.packagingGases || "",
        portionSize: productToDuplicate.portionSize || "",
        unit: productToDuplicate.unit || "",
        kj: productToDuplicate.kj || "",
        fat: productToDuplicate.fat || "",
        carbohydrates: productToDuplicate.carbohydrates || "",
        organic: productToDuplicate.organic || false,
        vegetarian: productToDuplicate.vegetarian || false,
        vegan: productToDuplicate.vegan || false,
        operatorType: productToDuplicate.operatorType || "",
        operatorName: productToDuplicate.operatorName || "",
        operatorAddress: productToDuplicate.operatorAddress || "",
        additionalInformation: productToDuplicate.additionalInformation || "",
        countryOfOrigin: productToDuplicate.countryOfOrigin || "",
        ean: "", // Clear EAN for duplicate
        barcodeLink: productToDuplicate.barcodeLink || "",
      });
    }
  }, [productToDuplicate, form]);

  const onSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync(data);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setLocation("/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Product</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Add a new wine product to your inventory</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Château Margaux" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="netVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Volume</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 750ml" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Wine Details */}
            <Card>
              <CardHeader>
                <CardTitle>Wine Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vintage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vintage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wine Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select wine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="red">Red Wine</SelectItem>
                          <SelectItem value="white">White Wine</SelectItem>
                          <SelectItem value="rosé">Rosé Wine</SelectItem>
                          <SelectItem value="sparkling">Sparkling Wine</SelectItem>
                          <SelectItem value="dessert">Dessert Wine</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sugarContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sugar Content</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sugar content" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dry">Dry</SelectItem>
                          <SelectItem value="semi-dry">Semi-Dry</SelectItem>
                          <SelectItem value="sweet">Sweet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appellation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appellation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bordeaux AOC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alcoholContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Content</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 13.5%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="packagingGases"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packaging Gases</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List packaging gases used..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Nutrition Information */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="portionSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portion Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 100ml" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ml" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>kJ</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 347" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carbohydrates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbohydrates (g)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1.4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="organic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Organic</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vegetarian"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Vegetarian</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vegan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Vegan</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Food Business Operator */}
            <Card>
              <CardHeader>
                <CardTitle>Food Business Operator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="operatorType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="producer">Producer</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="importer">Importer</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operatorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="operatorAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Complete address..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information..." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Logistics */}
            <Card>
              <CardHeader>
                <CardTitle>Logistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryOfOrigin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ean"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EAN</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1234567890123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Portability */}
            <Card>
              <CardHeader>
                <CardTitle>Portability</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="barcodeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/barcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={createProduct.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                {createProduct.isPending ? "Creating..." : "Create Product"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation("/products")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}