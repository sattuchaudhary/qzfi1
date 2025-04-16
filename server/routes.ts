import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { insertCategorySchema, insertTestSchema, insertQuestionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API router
  const apiRouter = express.Router();
  
  // Error handling middleware for validation errors
  const handleZodError = (err: any, res: Response) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    
    console.error("API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Categories endpoints
  apiRouter.get("/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.get("/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.post("/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.put("/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.delete("/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Tests endpoints
  apiRouter.get("/tests", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let tests;
      if (categoryId && !isNaN(categoryId)) {
        tests = await storage.getTestsByCategory(categoryId);
      } else {
        tests = await storage.getTests();
      }
      
      res.json(tests);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.get("/tests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test ID" });
      }
      
      const test = await storage.getTest(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.post("/tests", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTestSchema.parse(req.body);
      const test = await storage.createTest(validatedData);
      res.status(201).json(test);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.put("/tests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test ID" });
      }
      
      const validatedData = insertTestSchema.parse(req.body);
      const test = await storage.updateTest(id, validatedData);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.json(test);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.delete("/tests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid test ID" });
      }
      
      const success = await storage.deleteTest(id);
      if (!success) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Questions endpoints
  apiRouter.get("/questions", async (req: Request, res: Response) => {
    try {
      const testId = req.query.testId ? parseInt(req.query.testId as string) : undefined;
      
      let questions;
      if (testId && !isNaN(testId)) {
        questions = await storage.getQuestionsByTest(testId);
      } else {
        questions = await storage.getQuestions();
      }
      
      res.json(questions);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.get("/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const question = await storage.getQuestion(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.post("/questions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(validatedData);
      res.status(201).json(question);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.put("/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.updateQuestion(id, validatedData);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  apiRouter.delete("/questions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const success = await storage.deleteQuestion(id);
      if (!success) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Mount API routes
  app.use("/api", apiRouter);

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
