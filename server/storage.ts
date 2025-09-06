import { 
  users, 
  restaurants, 
  tables, 
  categories, 
  menuItems, 
  orders, 
  orderItems,
  type User, 
  type InsertUser,
  type Restaurant,
  type InsertRestaurant,
  type Table,
  type InsertTable,
  type Category,
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Restaurant methods
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant & { ownerId: string }): Promise<Restaurant>;
  
  // Table methods
  getTable(id: string): Promise<Table | undefined>;
  getTableByQrCode(qrCode: string): Promise<Table | undefined>;
  getTablesByRestaurant(restaurantId: string): Promise<Table[]>;
  createTable(table: InsertTable): Promise<Table>;
  
  // Category methods
  getCategoriesByRestaurant(restaurantId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Menu item methods
  getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  
  // Order methods
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByTable(tableId: string): Promise<Order[]>;
  getOrdersByRestaurant(restaurantId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order item methods
  getOrderItemsByOrder(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async getRestaurantByOwnerId(ownerId: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.ownerId, ownerId));
    return restaurant || undefined;
  }

  async createRestaurant(restaurant: InsertRestaurant & { ownerId: string }): Promise<Restaurant> {
    const [newRestaurant] = await db
      .insert(restaurants)
      .values(restaurant)
      .returning();
    return newRestaurant;
  }

  async getTable(id: string): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table || undefined;
  }

  async getTableByQrCode(qrCode: string): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.qrCode, qrCode));
    return table || undefined;
  }

  async getTablesByRestaurant(restaurantId: string): Promise<Table[]> {
    return await db.select().from(tables).where(eq(tables.restaurantId, restaurantId));
  }

  async createTable(table: InsertTable): Promise<Table> {
    // Generate QR code string
    const qrCode = `table_${table.restaurantId}_${table.tableNumber}_${Date.now()}`;
    const [newTable] = await db
      .insert(tables)
      .values({ ...table, qrCode })
      .returning();
    return newTable;
  }

  async getCategoriesByRestaurant(restaurantId: string): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.restaurantId, restaurantId));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId));
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db
      .insert(menuItems)
      .values(menuItem)
      .returning();
    return newItem;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [updated] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return updated || undefined;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByTable(tableId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.tableId, tableId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.restaurantId, restaurantId))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db
      .insert(orderItems)
      .values(orderItem)
      .returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
