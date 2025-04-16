import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Tests table
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  timeLimit: integer("time_limit"), // in minutes, optional
});

export const insertTestSchema = createInsertSchema(tests).pick({
  name: true,
  categoryId: true,
  timeLimit: true,
});

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  text: text("text").notNull(),
  options: text("options").array().notNull(), // Array of option strings
  correctOption: integer("correct_option").notNull(), // Index of the correct option (0-based)
  explanation: text("explanation"), // Optional explanation for the correct answer
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  testId: true,
  text: true,
  options: true,
  correctOption: true,
  explanation: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Users table (basic implementation for future auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
