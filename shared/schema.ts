import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, admin, staff
});

export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tables = pgTable("tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id),
  tableNumber: integer("table_number").notNull(),
  qrCode: text("qr_code").notNull().unique(),
  isActive: boolean("is_active").default(true),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id),
  name: text("name").notNull(),
  displayOrder: integer("display_order").default(0),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  tags: text("tags").array(),
  displayOrder: integer("display_order").default(0),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id),
  tableId: varchar("table_id").notNull().references(() => tables.id),
  customerId: varchar("customer_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, served, cancelled
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  serviceFee: decimal("service_fee", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  createdAt: timestamp("created_at").defaultNow(),
  estimatedTime: integer("estimated_time"), // in minutes
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  menuItemId: varchar("menu_item_id").notNull().references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  modifications: text("modifications"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  restaurants: many(restaurants),
  orders: many(orders),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  owner: one(users, {
    fields: [restaurants.ownerId],
    references: [users.id],
  }),
  tables: many(tables),
  categories: many(categories),
  menuItems: many(menuItems),
  orders: many(orders),
}));

export const tablesRelations = relations(tables, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [categories.restaurantId],
    references: [restaurants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).pick({
  name: true,
  description: true,
});

export const insertTableSchema = createInsertSchema(tables).pick({
  restaurantId: true,
  tableNumber: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  restaurantId: true,
  name: true,
  displayOrder: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  restaurantId: true,
  categoryId: true,
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  isAvailable: true,
  tags: true,
  displayOrder: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  restaurantId: true,
  tableId: true,
  customerId: true,
  subtotal: true,
  tax: true,
  serviceFee: true,
  total: true,
  estimatedTime: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  menuItemId: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
  modifications: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type User = typeof users.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
