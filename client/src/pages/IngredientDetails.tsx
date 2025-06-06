
import React from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useIngredient } from '@/hooks/useIngredients';

const IngredientDetails: React.FC = () => {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  
  const { data: ingredient, isLoading } = useIngredient(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Ingredient Not Found</h1>
            <p className="text-gray-600 mt-2">The ingredient you're looking for doesn't exist.</p>
            <Button 
              onClick={() => setLocation('/ingredients')}
              className="mt-4"
            >
              Back to Ingredients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation('/ingredients')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredient Details</h1>
          <p className="text-gray-600">Complete information about {ingredient.name}</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredient Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{ingredient.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-lg text-gray-900">{ingredient.category}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E Number
                  </label>
                  <p className="text-lg text-gray-900">
                    {ingredient.e_number || 'Not assigned'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredient ID
                  </label>
                  <p className="text-lg text-gray-900">{ingredient.id}</p>
                </div>
              </div>
              
              {ingredient.other_ingredient && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Details
                  </label>
                  <p className="text-gray-900">{ingredient.other_ingredient}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allergen Information */}
          <Card>
            <CardHeader>
              <CardTitle>Allergen Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Known Allergens
                </label>
                {ingredient.allergens && ingredient.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ingredient.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No known allergens</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Function/Purpose
                  </label>
                  <p className="text-gray-900">
                    {ingredient.category === 'Preservative' && 'Used to prevent spoilage and extend shelf life'}
                    {ingredient.category === 'Antioxidant' && 'Prevents oxidation and maintains product quality'}
                    {ingredient.category === 'Colorant' && 'Provides or maintains color in the product'}
                    {ingredient.category === 'Flavoring' && 'Enhances or adds flavor to the product'}
                    {ingredient.category === 'Stabilizer' && 'Maintains texture and consistency'}
                    {ingredient.category === 'Emulsifier' && 'Helps mix ingredients that normally separate'}
                    {ingredient.category === 'Acidifier' && 'Adjusts pH levels and adds tartness'}
                    {ingredient.category === 'Fining Agent' && 'Clarifies and purifies the wine during production'}
                    {ingredient.category === 'Other' && 'Serves a specialized function in wine production'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage in Wine Production
                  </label>
                  <p className="text-gray-900">
                    This ingredient is commonly used in wine production as a {ingredient.category.toLowerCase()}.
                    {ingredient.e_number && ` It is regulated under the E-number system as ${ingredient.e_number}.`}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Safety Information
                  </label>
                  <p className="text-gray-900">
                    {ingredient.allergens && ingredient.allergens.length > 0 
                      ? `Contains allergens: ${ingredient.allergens.join(', ')}. Please check with individuals who have allergies before consumption.`
                      : 'No known allergens associated with this ingredient.'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {new Date(ingredient.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {new Date(ingredient.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
