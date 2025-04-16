import {
  Category,
  InsertCategory,
  Test,
  InsertTest,
  Question,
  InsertQuestion,
  User,
  InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Tests
  getTests(): Promise<Test[]>;
  getTestsByCategory(categoryId: number): Promise<Test[]>;
  getTest(id: number): Promise<Test | undefined>;
  createTest(test: InsertTest): Promise<Test>;
  updateTest(id: number, test: InsertTest): Promise<Test | undefined>;
  deleteTest(id: number): Promise<boolean>;
  
  // Questions
  getQuestions(): Promise<Question[]>;
  getQuestionsByTest(testId: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: InsertQuestion): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private tests: Map<number, Test>;
  private questions: Map<number, Question>;
  private users: Map<number, User>;
  
  private categoryId: number;
  private testId: number;
  private questionId: number;
  private userId: number;

  constructor() {
    this.categories = new Map();
    this.tests = new Map();
    this.questions = new Map();
    this.users = new Map();
    
    this.categoryId = 1;
    this.testId = 1;
    this.questionId = 1;
    this.userId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample categories
    const categories = [
      { name: "Current Affairs", description: "Stay updated with the latest events and news around the world." },
      { name: "General Knowledge", description: "Test your awareness about various general topics and trivia." },
      { name: "Science & Technology", description: "Explore the world of science and technological advancements." },
      { name: "History", description: "Journey through important historical events and facts." },
      { name: "Sports", description: "Challenge your knowledge about various sports and athletes." },
      { name: "Entertainment", description: "Test your knowledge of movies, music, and pop culture." },
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });

    // Add sample tests
    const tests = [
      { name: "Weekly Current Affairs: August 1-7, 2023", categoryId: 1, timeLimit: 15 },
      { name: "International Relations Quiz", categoryId: 1, timeLimit: 20 },
      { name: "Economic Policies & Developments", categoryId: 1, timeLimit: 12 },
      { name: "Global Leaders & Politics", categoryId: 1, timeLimit: 18 },
      { name: "General Science Quiz", categoryId: 3, timeLimit: 15 },
      { name: "Technology Innovations 2023", categoryId: 3, timeLimit: 20 },
    ];
    
    tests.forEach(test => {
      this.createTest(test);
    });

    // Add sample questions
    const questions = [
      {
        testId: 1,
        text: "Which country hosted the G7 Summit in 2023?",
        options: ["United States", "Japan", "Germany", "Italy"],
        correctOption: 1, // Japan (0-based index)
        explanation: "The G7 Summit was held in Hiroshima, Japan in May 2023."
      },
      {
        testId: 1,
        text: "Which technology company announced its 'Copilot' AI assistant in 2023?",
        options: ["Google", "Apple", "Microsoft", "Meta"],
        correctOption: 2, // Microsoft
        explanation: "Microsoft announced its 'Copilot' AI assistant for various products in 2023."
      },
      {
        testId: 1,
        text: "Which country became the fourth nation to land on the moon in August 2023?",
        options: ["China", "India", "Israel", "United Arab Emirates"],
        correctOption: 1, // India
        explanation: "India became the fourth country to successfully land on the moon with its Chandrayaan-3 mission."
      },
      {
        testId: 2,
        text: "Which organization oversees international trade regulations?",
        options: ["IMF", "World Bank", "WTO", "UNICEF"],
        correctOption: 2, // WTO
        explanation: "The World Trade Organization (WTO) is responsible for regulating international trade."
      },
    ];
    
    questions.forEach(question => {
      this.createQuestion(question);
    });

    // Add admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      isAdmin: true
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateCategory: InsertCategory): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = { ...category, ...updateCategory };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Tests
  async getTests(): Promise<Test[]> {
    return Array.from(this.tests.values());
  }

  async getTestsByCategory(categoryId: number): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(
      (test) => test.categoryId === categoryId
    );
  }

  async getTest(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const id = this.testId++;
    const test: Test = { 
      ...insertTest, 
      id, 
      uploadDate: new Date() 
    };
    this.tests.set(id, test);
    return test;
  }

  async updateTest(id: number, updateTest: InsertTest): Promise<Test | undefined> {
    const test = this.tests.get(id);
    if (!test) return undefined;
    
    const updatedTest: Test = { ...test, ...updateTest };
    this.tests.set(id, updatedTest);
    return updatedTest;
  }

  async deleteTest(id: number): Promise<boolean> {
    return this.tests.delete(id);
  }

  // Questions
  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByTest(testId: number): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      (question) => question.testId === testId
    );
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: number, updateQuestion: InsertQuestion): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;
    
    const updatedQuestion: Question = { ...question, ...updateQuestion };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    return this.questions.delete(id);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
