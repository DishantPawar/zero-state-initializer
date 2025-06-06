
import { Database } from '@/integrations/supabase/types';

export type Ingredient = Database['public']['Tables']['ingredients']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductIngredient = Database['public']['Tables']['product_ingredients']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type IngredientInsert = Database['public']['Tables']['ingredients']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductIngredientInsert = Database['public']['Tables']['product_ingredients']['Insert'];

export type IngredientUpdate = Database['public']['Tables']['ingredients']['Update'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
