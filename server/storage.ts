import { 
  type User, 
  type InsertUser, 
  type Restaurant, 
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type QrCode,
  type InsertQrCode
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Restaurants
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getAllRestaurants(): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant | undefined>;

  // Menu Items
  getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByRestaurant(restaurantId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // QR Codes
  getQrCode(id: string): Promise<QrCode | undefined>;
  getQrCodesByRestaurant(restaurantId: string): Promise<QrCode[]>;
  createQrCode(qrCode: InsertQrCode): Promise<QrCode>;
  getQrCodeByTableAndRestaurant(restaurantId: string, tableNumber: number): Promise<QrCode | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private restaurants: Map<string, Restaurant>;
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private qrCodes: Map<string, QrCode>;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.qrCodes = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample restaurant
    const restaurant = await this.createRestaurant({
      name: "Delicious Bistro",
      address: "123 Main St, City",
      phone: "+1234567890",
      isOpen: true,
      ownerId: null
    });

    // Create sample menu items
    const menuItems = [
      {
        restaurantId: restaurant.id,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce, parmesan cheese, croutons with Caesar dressing",
        price: "12.00",
        category: "Appetizers",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Buffalo Wings",
        description: "Spicy buffalo wings served with celery sticks and blue cheese dip",
        price: "15.00",
        category: "Appetizers",
        imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Mushroom Soup",
        description: "Creamy mushroom soup with fresh herbs and a touch of white wine",
        price: "9.00",
        category: "Appetizers",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with roasted vegetables and lemon butter sauce",
        price: "28.00",
        category: "Main Courses",
        imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isAvailable: true
      },
      {
        restaurantId: restaurant.id,
        name: "Ribeye Steak",
        description: "12oz ribeye steak with garlic mashed potatoes and seasonal vegetables",
        price: "35.00",
        category: "Main Courses",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        isAvailable: true
      }
    ];

    for (const item of menuItems) {
      await this.createMenuItem(item);
    }

    // Create sample QR codes for tables 1-10
    for (let i = 1; i <= 10; i++) {
      await this.createQrCode({
        restaurantId: restaurant.id,
        tableNumber: i,
        qrData: `/menu/${restaurant.id}/${i}`,
        isActive: true
      });
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Restaurants
  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = randomUUID();
    const restaurant: Restaurant = { ...insertRestaurant, id };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant | undefined> {
    const restaurant = this.restaurants.get(id);
    if (!restaurant) return undefined;
    
    const updated = { ...restaurant, ...updates };
    this.restaurants.set(id, updated);
    return updated;
  }

  // Menu Items
  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.restaurantId === restaurantId
    );
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: string, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) {
      return undefined;
    }
    
    const updatedItem: MenuItem = { ...existingItem, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const menuItem = this.menuItems.get(id);
    if (!menuItem) return undefined;
    
    const updated = { ...menuItem, ...updates };
    this.menuItems.set(id, updated);
    return updated;
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.restaurantId === restaurantId
    );
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  // QR Codes
  async getQrCode(id: string): Promise<QrCode | undefined> {
    return this.qrCodes.get(id);
  }

  async getQrCodesByRestaurant(restaurantId: string): Promise<QrCode[]> {
    return Array.from(this.qrCodes.values()).filter(
      qr => qr.restaurantId === restaurantId
    );
  }

  async createQrCode(insertQrCode: InsertQrCode): Promise<QrCode> {
    const id = randomUUID();
    const qrCode: QrCode = { 
      ...insertQrCode, 
      id, 
      createdAt: new Date()
    };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async getQrCodeByTableAndRestaurant(restaurantId: string, tableNumber: number): Promise<QrCode | undefined> {
    return Array.from(this.qrCodes.values()).find(
      qr => qr.restaurantId === restaurantId && qr.tableNumber === tableNumber
    );
  }
}

export const storage = new MemStorage();
