import { 
  restaurants,
  menuCategories,
  menuItems,
  tables,
  orders,
  orderItems,
  type Restaurant,
  type InsertRestaurant,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type MenuItemWithCategory,
  type Table,
  type InsertTable,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithDetails
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Restaurant operations
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Menu category operations
  getMenuCategories(restaurantId: string): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  
  // Menu item operations
  getMenuItems(restaurantId: string, categoryId?: string): Promise<MenuItemWithCategory[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  
  // Table operations
  getTables(restaurantId: string): Promise<Table[]>;
  getTable(id: string): Promise<Table | undefined>;
  getTableByNumber(restaurantId: string, tableNumber: string): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: string, table: Partial<InsertTable>): Promise<Table>;
  
  // Order operations
  getOrders(restaurantId: string, status?: string): Promise<OrderWithDetails[]>;
  getOrder(id: string): Promise<OrderWithDetails | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  
  // Initialize sample data
  initializeSampleData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db
      .insert(restaurants)
      .values(restaurant)
      .returning();
    return newRestaurant;
  }

  async getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
    return await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.restaurantId, restaurantId))
      .orderBy(asc(menuCategories.displayOrder), asc(menuCategories.name));
  }

  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const [newCategory] = await db
      .insert(menuCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getMenuItems(restaurantId: string, categoryId?: string): Promise<MenuItemWithCategory[]> {
    const query = db
      .select({
        id: menuItems.id,
        restaurantId: menuItems.restaurantId,
        categoryId: menuItems.categoryId,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        imageUrl: menuItems.imageUrl,
        available: menuItems.available,
        displayOrder: menuItems.displayOrder,
        createdAt: menuItems.createdAt,
        updatedAt: menuItems.updatedAt,
        category: {
          id: menuCategories.id,
          restaurantId: menuCategories.restaurantId,
          name: menuCategories.name,
          displayOrder: menuCategories.displayOrder,
          createdAt: menuCategories.createdAt,
        }
      })
      .from(menuItems)
      .leftJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
      .where(
        categoryId 
          ? and(eq(menuItems.restaurantId, restaurantId), eq(menuItems.categoryId, categoryId))
          : eq(menuItems.restaurantId, restaurantId)
      )
      .orderBy(asc(menuItems.displayOrder), asc(menuItems.name));

    return await query as MenuItemWithCategory[];
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db
      .insert(menuItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updatedItem] = await db
      .update(menuItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem;
  }

  async getTables(restaurantId: string): Promise<Table[]> {
    return await db
      .select()
      .from(tables)
      .where(eq(tables.restaurantId, restaurantId))
      .orderBy(asc(tables.tableNumber));
  }

  async getTable(id: string): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table || undefined;
  }

  async getTableByNumber(restaurantId: string, tableNumber: string): Promise<Table | undefined> {
    const [table] = await db
      .select()
      .from(tables)
      .where(and(eq(tables.restaurantId, restaurantId), eq(tables.tableNumber, tableNumber)));
    return table || undefined;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const [newTable] = await db
      .insert(tables)
      .values(table)
      .returning();
    return newTable;
  }

  async updateTable(id: string, table: Partial<InsertTable>): Promise<Table> {
    const [updatedTable] = await db
      .update(tables)
      .set({ ...table, updatedAt: new Date() })
      .where(eq(tables.id, id))
      .returning();
    return updatedTable;
  }

  async getOrders(restaurantId: string, status?: string): Promise<OrderWithDetails[]> {
    const query = db
      .select({
        id: orders.id,
        restaurantId: orders.restaurantId,
        tableId: orders.tableId,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        status: orders.status,
        orderType: orders.orderType,
        totalAmount: orders.totalAmount,
        notes: orders.notes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .where(
        status
          ? and(eq(orders.restaurantId, restaurantId), eq(orders.status, status))
          : eq(orders.restaurantId, restaurantId)
      )
      .orderBy(desc(orders.createdAt));

    const orderResults = await query;

    // Fetch order items and related data for each order
    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const order of orderResults) {
      const items = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          menuItemId: orderItems.menuItemId,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          totalPrice: orderItems.totalPrice,
          notes: orderItems.notes,
          menuItem: {
            id: menuItems.id,
            restaurantId: menuItems.restaurantId,
            categoryId: menuItems.categoryId,
            name: menuItems.name,
            description: menuItems.description,
            price: menuItems.price,
            imageUrl: menuItems.imageUrl,
            available: menuItems.available,
            displayOrder: menuItems.displayOrder,
            createdAt: menuItems.createdAt,
            updatedAt: menuItems.updatedAt,
          }
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(orderItems.orderId, order.id));

      const table = order.tableId ? await this.getTable(order.tableId) : undefined;

      ordersWithDetails.push({
        ...order,
        orderItems: items as (OrderItem & { menuItem: MenuItem; })[],
        table,
      });
    }

    return ordersWithDetails;
  }

  async getOrder(id: string): Promise<OrderWithDetails | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        menuItemId: orderItems.menuItemId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        totalPrice: orderItems.totalPrice,
        notes: orderItems.notes,
        menuItem: {
          id: menuItems.id,
          restaurantId: menuItems.restaurantId,
          categoryId: menuItems.categoryId,
          name: menuItems.name,
          description: menuItems.description,
          price: menuItems.price,
          imageUrl: menuItems.imageUrl,
          available: menuItems.available,
          displayOrder: menuItems.displayOrder,
          createdAt: menuItems.createdAt,
          updatedAt: menuItems.updatedAt,
        }
      })
      .from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(eq(orderItems.orderId, order.id));

    const table = order.tableId ? await this.getTable(order.tableId) : undefined;

    return {
      ...order,
      orderItems: items as (OrderItem & { menuItem: MenuItem; })[],
      table,
    };
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails> {
    const [newOrder] = await db
      .insert(orders)
      .values(orderData)
      .returning();

    // Insert order items
    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));

    await db.insert(orderItems).values(orderItemsWithOrderId);

    const orderWithDetails = await this.getOrder(newOrder.id);
    if (!orderWithDetails) {
      throw new Error("Failed to retrieve created order");
    }

    return orderWithDetails;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async initializeSampleData(): Promise<void> {
    // Check if restaurant already exists
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    if (existingRestaurants.length > 0) {
      return; // Sample data already exists
    }

    // Create sample restaurant
    const [restaurant] = await db
      .insert(restaurants)
      .values({
        name: "Bella Vista Restaurant",
        address: "123 Main Street, Downtown",
        description: "Authentic Italian Cuisine"
      })
      .returning();

    // Create menu categories
    const categories = [
      { name: "Appetizers", displayOrder: 1 },
      { name: "Main Course", displayOrder: 2 },
      { name: "Desserts", displayOrder: 3 },
      { name: "Beverages", displayOrder: 4 }
    ];

    const createdCategories: MenuCategory[] = [];
    for (const category of categories) {
      const [newCategory] = await db
        .insert(menuCategories)
        .values({
          ...category,
          restaurantId: restaurant.id
        })
        .returning();
      createdCategories.push(newCategory);
    }

    // Create sample menu items
    const sampleItems = [
      {
        categoryIndex: 0, // Appetizers
        items: [
          {
            name: "Bruschetta Italiana",
            description: "Fresh tomatoes, basil, garlic on toasted bread",
            price: "12.00",
            imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          },
          {
            name: "Calamari Fritti",
            description: "Crispy fried squid rings with marinara sauce",
            price: "16.00",
            imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          }
        ]
      },
      {
        categoryIndex: 1, // Main Course
        items: [
          {
            name: "Pizza Margherita",
            description: "Fresh mozzarella, tomato sauce, basil, olive oil",
            price: "24.00",
            imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          },
          {
            name: "Salmone alla Griglia",
            description: "Grilled Atlantic salmon with lemon butter sauce",
            price: "32.00",
            imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          },
          {
            name: "Pasta Carbonara",
            description: "Traditional Roman pasta with eggs, cheese, and pancetta",
            price: "22.00",
            imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d524?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          },
          {
            name: "Bistecca alla Griglia",
            description: "Premium ribeye steak with roasted seasonal vegetables",
            price: "45.00",
            imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          }
        ]
      },
      {
        categoryIndex: 2, // Desserts
        items: [
          {
            name: "Tiramisu",
            description: "Classic Italian dessert with coffee and mascarpone",
            price: "14.00",
            imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          },
          {
            name: "Gelato Trio",
            description: "Three scoops of artisanal gelato with fresh berries",
            price: "10.00",
            imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          }
        ]
      }
    ];

    for (const categoryData of sampleItems) {
      const category = createdCategories[categoryData.categoryIndex];
      for (const item of categoryData.items) {
        await db.insert(menuItems).values({
          ...item,
          restaurantId: restaurant.id,
          categoryId: category.id
        });
      }
    }

    // Create sample tables
    const sampleTables = [
      { tableNumber: "12", section: "Section A" },
      { tableNumber: "8", section: "Section B" },
      { tableNumber: "5", section: "Section A" },
      { tableNumber: "15", section: "Section A" },
      { tableNumber: "3", section: "Outdoor" }
    ];

    for (const table of sampleTables) {
      await db.insert(tables).values({
        ...table,
        restaurantId: restaurant.id,
        qrCodeUrl: `https://menu.bellavista.com/table/${table.tableNumber}`
      });
    }
  }
}

export const storage = new DatabaseStorage();
