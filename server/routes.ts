import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertIngredientSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Ingredients API Routes
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getIngredients();
      res.json(ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      res.status(500).json({ error: "Failed to fetch ingredients" });
    }
  });

  app.get("/api/ingredients/:id", async (req, res) => {
    try {
      const ingredient = await storage.getIngredient(req.params.id);
      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      }
      res.json(ingredient);
    } catch (error) {
      console.error("Error fetching ingredient:", error);
      res.status(500).json({ error: "Failed to fetch ingredient" });
    }
  });

  app.post("/api/ingredients", async (req, res) => {
    try {
      const validatedData = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(validatedData);
      res.status(201).json(ingredient);
    } catch (error) {
      console.error("Error creating ingredient:", error);
      res.status(400).json({ error: "Failed to create ingredient" });
    }
  });

  app.put("/api/ingredients/:id", async (req, res) => {
    try {
      const validatedData = insertIngredientSchema.partial().parse(req.body);
      const ingredient = await storage.updateIngredient(req.params.id, validatedData);
      res.json(ingredient);
    } catch (error) {
      console.error("Error updating ingredient:", error);
      res.status(400).json({ error: "Failed to update ingredient" });
    }
  });

  app.delete("/api/ingredients/:id", async (req, res) => {
    try {
      await storage.deleteIngredient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      res.status(500).json({ error: "Failed to delete ingredient" });
    }
  });

  // Product-Ingredient relationship routes
  app.get("/api/products/:id/ingredients", async (req, res) => {
    try {
      const productIngredients = await storage.getProductIngredients(req.params.id);
      res.json(productIngredients);
    } catch (error) {
      console.error("Error fetching product ingredients:", error);
      res.status(500).json({ error: "Failed to fetch product ingredients" });
    }
  });

  app.post("/api/products/:productId/ingredients/:ingredientId", async (req, res) => {
    try {
      const productIngredient = await storage.addProductIngredient({
        productId: req.params.productId,
        ingredientId: req.params.ingredientId
      });
      res.status(201).json(productIngredient);
    } catch (error) {
      console.error("Error adding ingredient to product:", error);
      res.status(400).json({ error: "Failed to add ingredient to product" });
    }
  });

  app.delete("/api/products/:productId/ingredients/:ingredientId", async (req, res) => {
    try {
      await storage.removeProductIngredient(req.params.productId, req.params.ingredientId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing ingredient from product:", error);
      res.status(500).json({ error: "Failed to remove ingredient from product" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
