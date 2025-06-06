import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema } from "@shared/schema";
import type { InsertProduct } from "@shared/schema";

export default function CreateProductForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProduct>({
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
      ingredients: "",
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
      additionalInfo: "",
      countryOfOrigin: "",
      ean: "",
      barcodeLink: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      return await apiRequest("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      // Clear form data
      form.reset();
      // Invalidate and refetch products using the correct query key
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      // Navigate back to products list
      setTimeout(() => {
        setLocation("/products");
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    // Convert text input values to booleans for certification fields
    const processedData = {
      ...data,
      organic: data.organic === true || (typeof data.organic === 'string' && data.organic.toLowerCase() === 'true'),
      vegetarian: data.vegetarian === true || (typeof data.vegetarian === 'string' && data.vegetarian.toLowerCase() === 'true'),
      vegan: data.vegan === true || (typeof data.vegan === 'string' && data.vegan.toLowerCase() === 'true'),
    };
    createProductMutation.mutate(processedData);
  };

  const handleCancel = () => {
    setLocation("/products");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground">Add a new product to your inventory</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter product name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...form.register("brand")}
                  placeholder="Enter brand name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netVolume">Net Volume</Label>
                <Input
                  id="netVolume"
                  {...form.register("netVolume")}
                  placeholder="e.g., 750ml"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wine Details */}
        <Card>
          <CardHeader>
            <CardTitle>Wine Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vintage">Vintage</Label>
                <Input
                  id="vintage"
                  {...form.register("vintage")}
                  placeholder="e.g., 2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wineType">Wine Type</Label>
                <Input
                  id="wineType"
                  {...form.register("wineType")}
                  placeholder="e.g., Red Wine, White Wine"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugarContent">Sugar Content</Label>
                <Input
                  id="sugarContent"
                  {...form.register("sugarContent")}
                  placeholder="e.g., Dry, Semi-Sweet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appellation">Appellation</Label>
                <Input
                  id="appellation"
                  {...form.register("appellation")}
                  placeholder="Enter appellation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcoholContent">Alcohol Content</Label>
                <Input
                  id="alcoholContent"
                  {...form.register("alcoholContent")}
                  placeholder="e.g., 13.5%"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Input
                id="ingredients"
                {...form.register("ingredients")}
                placeholder="List all ingredients"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packagingGases">Packaging Gases</Label>
              <Input
                id="packagingGases"
                {...form.register("packagingGases")}
                placeholder="e.g., Nitrogen, Carbon Dioxide"
              />
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Information */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portionSize">Portion Size</Label>
                <Input
                  id="portionSize"
                  {...form.register("portionSize")}
                  placeholder="e.g., 100ml"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  {...form.register("unit")}
                  placeholder="e.g., ml, g"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kj">Energy (kJ)</Label>
                <Input
                  id="kj"
                  {...form.register("kj")}
                  placeholder="Energy in kilojoules"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  {...form.register("fat")}
                  placeholder="Fat content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbohydrates">Carbohydrates</Label>
                <Input
                  id="carbohydrates"
                  {...form.register("carbohydrates")}
                  placeholder="Carbohydrate content"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organic">Organic</Label>
                <Input
                  id="organic"
                  {...form.register("organic")}
                  placeholder="true/false"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vegetarian">Vegetarian</Label>
                <Input
                  id="vegetarian"
                  {...form.register("vegetarian")}
                  placeholder="true/false"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vegan">Vegan</Label>
                <Input
                  id="vegan"
                  {...form.register("vegan")}
                  placeholder="true/false"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Business Operator */}
        <Card>
          <CardHeader>
            <CardTitle>Food Business Operator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operatorType">Operator Type</Label>
                <Input
                  id="operatorType"
                  {...form.register("operatorType")}
                  placeholder="e.g., Manufacturer, Distributor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatorName">Operator Name</Label>
                <Input
                  id="operatorName"
                  {...form.register("operatorName")}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="operatorAddress">Operator Address</Label>
                <Input
                  id="operatorAddress"
                  {...form.register("operatorAddress")}
                  placeholder="Full address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Info</Label>
              <Input
                id="additionalInfo"
                {...form.register("additionalInfo")}
                placeholder="Any additional information"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card>
          <CardHeader>
            <CardTitle>Logistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                <Input
                  id="countryOfOrigin"
                  {...form.register("countryOfOrigin")}
                  placeholder="e.g., France, Italy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ean">EAN</Label>
                <Input
                  id="ean"
                  {...form.register("ean")}
                  placeholder="EAN barcode number"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="barcodeLink">Barcode Link</Label>
                <Input
                  id="barcodeLink"
                  {...form.register("barcodeLink")}
                  placeholder="Link to barcode image or resource"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={createProductMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}