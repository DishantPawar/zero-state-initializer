import { pgTable, text, serial, integer, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  netVolume: text("net_volume").notNull(),
  vintage: text("vintage"),
  type: text("type"),
  sugarContent: text("sugar_content"),
  appellation: text("appellation"),
  sku: text("sku").notNull(),
  alcohol: text("alcohol"),
  country: text("country"),
  ean: text("ean"),
  packagingGases: text("packaging_gases"),
  portion: text("portion"),
  kcal: text("kcal"),
  kj: text("kj"),
  fat: text("fat"),
  carbs: text("carbs"),
  organic: boolean("organic").default(false),
  vegetarian: boolean("vegetarian").default(false),
  vegan: boolean("vegan").default(false),
  operatorType: text("operator_type"),
  operatorName: text("operator_name"),
  operatorAddress: text("operator_address"),
  operatorAdditionalInfo: text("operator_additional_info"),
  externalLink: text("external_link"),
  redirectLink: text("redirect_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  eNumber: text("e_number"),
  otherIngredient: text("other_ingredient"),
  allergens: text("allergens").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productIngredients = pgTable("product_ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  ingredientId: uuid("ingredient_id").notNull().references(() => ingredients.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductIngredientSchema = createInsertSchema(productIngredients).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type ProductIngredient = typeof productIngredients.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type InsertProductIngredient = z.infer<typeof insertProductIngredientSchema>;
