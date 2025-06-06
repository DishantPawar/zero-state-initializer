import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, products, ingredients, productIngredients, type User, type InsertUser, type Product, type InsertProduct, type Ingredient, type InsertIngredient, type ProductIngredient, type InsertProductIngredient } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Ingredient methods
  getIngredients(): Promise<Ingredient[]>;
  getIngredient(id: string): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: string, ingredient: Partial<InsertIngredient>): Promise<Ingredient>;
  deleteIngredient(id: string): Promise<void>;
  
  // Product-Ingredient relationship methods
  getProductIngredients(productId: string): Promise<ProductIngredient[]>;
  addProductIngredient(productIngredient: InsertProductIngredient): Promise<ProductIngredient>;
  removeProductIngredient(productId: string, ingredientId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.createdAt);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const result = await db.update(products).set({
      ...product,
      updatedAt: new Date()
    }).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Ingredient methods
  async getIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients).orderBy(ingredients.createdAt);
  }

  async getIngredient(id: string): Promise<Ingredient | undefined> {
    const result = await db.select().from(ingredients).where(eq(ingredients.id, id)).limit(1);
    return result[0];
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const result = await db.insert(ingredients).values(ingredient).returning();
    return result[0];
  }

  async updateIngredient(id: string, ingredient: Partial<InsertIngredient>): Promise<Ingredient> {
    const result = await db.update(ingredients).set({
      ...ingredient,
      updatedAt: new Date()
    }).where(eq(ingredients.id, id)).returning();
    return result[0];
  }

  async deleteIngredient(id: string): Promise<void> {
    await db.delete(ingredients).where(eq(ingredients.id, id));
  }

  // Product-Ingredient relationship methods
  async getProductIngredients(productId: string): Promise<ProductIngredient[]> {
    return await db.select().from(productIngredients).where(eq(productIngredients.productId, productId));
  }

  async addProductIngredient(productIngredient: InsertProductIngredient): Promise<ProductIngredient> {
    const result = await db.insert(productIngredients).values(productIngredient).returning();
    return result[0];
  }

  async removeProductIngredient(productId: string, ingredientId: string): Promise<void> {
    await db.delete(productIngredients)
      .where(and(
        eq(productIngredients.productId, productId),
        eq(productIngredients.ingredientId, ingredientId)
      ));
  }
}

export const storage = new DatabaseStorage();
