export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          allergens: string[] | null
          category: Database["public"]["Enums"]["ingredient_category"]
          created_at: string | null
          e_number: string | null
          id: string
          name: string
          other_ingredient: string | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          category: Database["public"]["Enums"]["ingredient_category"]
          created_at?: string | null
          e_number?: string | null
          id?: string
          name: string
          other_ingredient?: string | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          category?: Database["public"]["Enums"]["ingredient_category"]
          created_at?: string | null
          e_number?: string | null
          id?: string
          name?: string
          other_ingredient?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_ingredients: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string | null
          product_id: string | null
          quantity: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
          quantity?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alcohol_content: number | null
          appellation: string
          barcode: string | null
          brand: string
          created_at: string | null
          description: string | null
          expiry_date: string | null
          grape_varieties: string[] | null
          id: string
          name: string
          net_volume: string
          producer: string | null
          production_date: string | null
          qr_code: string | null
          region: string | null
          serving_temperature_max: number | null
          serving_temperature_min: number | null
          sku: string
          storage_instructions: string | null
          sugar_content: Database["public"]["Enums"]["sugar_content"]
          type: Database["public"]["Enums"]["wine_type"]
          updated_at: string | null
          vintage: number | null
        }
        Insert: {
          alcohol_content?: number | null
          appellation: string
          barcode?: string | null
          brand: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          grape_varieties?: string[] | null
          id?: string
          name: string
          net_volume: string
          producer?: string | null
          production_date?: string | null
          qr_code?: string | null
          region?: string | null
          serving_temperature_max?: number | null
          serving_temperature_min?: number | null
          sku: string
          storage_instructions?: string | null
          sugar_content: Database["public"]["Enums"]["sugar_content"]
          type: Database["public"]["Enums"]["wine_type"]
          updated_at?: string | null
          vintage?: number | null
        }
        Update: {
          alcohol_content?: number | null
          appellation?: string
          barcode?: string | null
          brand?: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          grape_varieties?: string[] | null
          id?: string
          name?: string
          net_volume?: string
          producer?: string | null
          production_date?: string | null
          qr_code?: string | null
          region?: string | null
          serving_temperature_max?: number | null
          serving_temperature_min?: number | null
          sku?: string
          storage_instructions?: string | null
          sugar_content?: Database["public"]["Enums"]["sugar_content"]
          type?: Database["public"]["Enums"]["wine_type"]
          updated_at?: string | null
          vintage?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ingredient_category:
        | "Preservative"
        | "Antioxidant"
        | "Colorant"
        | "Flavoring"
        | "Stabilizer"
        | "Emulsifier"
        | "Acidifier"
        | "Fining Agent"
        | "Other"
      sugar_content: "Dry" | "Semi-Dry" | "Semi-Sweet" | "Sweet"
      wine_type:
        | "Red"
        | "White"
        | "Rosé"
        | "Sparkling"
        | "Dessert"
        | "Fortified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ingredient_category: [
        "Preservative",
        "Antioxidant",
        "Colorant",
        "Flavoring",
        "Stabilizer",
        "Emulsifier",
        "Acidifier",
        "Fining Agent",
        "Other",
      ],
      sugar_content: ["Dry", "Semi-Dry", "Semi-Sweet", "Sweet"],
      wine_type: ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"],
    },
  },
} as const
