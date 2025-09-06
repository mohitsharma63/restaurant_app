import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema, insertTableSchema, insertMenuItemSchema, restaurants } from "@shared/schema";
import { db } from "./db";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize sample data
  await storage.initializeSampleData();

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Restaurant routes
  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Get default restaurant (for demo purposes)
  app.get("/api/restaurant", async (req, res) => {
    try {
      // Get the first restaurant for demo - query restaurants directly
      const result = await db.select().from(restaurants).limit(1);
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ message: "No restaurant found" });
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Menu routes
  app.get("/api/restaurants/:restaurantId/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories(req.params.restaurantId);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/restaurants/:restaurantId/menu", async (req, res) => {
    try {
      const { categoryId } = req.query;
      const menuItems = await storage.getMenuItems(
        req.params.restaurantId, 
        categoryId as string
      );
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get menu for default restaurant
  app.get("/api/menu", async (req, res) => {
    try {
      // Get the first restaurant for demo
      const result = await db.select().from(restaurants).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ message: "No restaurant found" });
      }

      const { categoryId } = req.query;
      const menuItems = await storage.getMenuItems(result[0].id, categoryId as string);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      // Get the first restaurant for demo
      const result = await db.select().from(restaurants).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ message: "No restaurant found" });
      }

      const categories = await storage.getMenuCategories(result[0].id);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Table routes
  app.get("/api/restaurants/:restaurantId/tables", async (req, res) => {
    try {
      const tables = await storage.getTables(req.params.restaurantId);
      res.json(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });

  app.get("/api/tables/:id", async (req, res) => {
    try {
      const table = await storage.getTable(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      res.json(table);
    } catch (error) {
      console.error("Error fetching table:", error);
      res.status(500).json({ message: "Failed to fetch table" });
    }
  });

  app.post("/api/restaurants/:restaurantId/tables", async (req, res) => {
    try {
      const tableData = insertTableSchema.parse({
        ...req.body,
        restaurantId: req.params.restaurantId,
      });
      
      // Generate QR code URL
      const qrCodeUrl = `${req.protocol}://${req.get('host')}/menu/${req.params.restaurantId}/${tableData.tableNumber}`;
      
      const table = await storage.createTable({
        ...tableData,
        qrCodeUrl,
      });
      
      res.status(201).json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating table:", error);
      res.status(500).json({ message: "Failed to create table" });
    }
  });

  // Order routes
  app.get("/api/restaurants/:restaurantId/orders", async (req, res) => {
    try {
      const { status } = req.query;
      const orders = await storage.getOrders(req.params.restaurantId, status as string);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get orders for default restaurant
  app.get("/api/orders", async (req, res) => {
    try {
      const { status } = req.query;
      // For demo, get orders from first available restaurant
      const allOrders = await storage.getOrders("", status as string);
      res.json(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { orderData, items } = req.body;
      
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      // Calculate total amount
      let totalAmount = 0;
      const validatedItems = [];
      
      for (const item of items) {
        const menuItem = await storage.getMenuItem(item.menuItemId);
        if (!menuItem) {
          return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` });
        }
        
        const unitPrice = parseFloat(menuItem.price);
        const totalPrice = unitPrice * item.quantity;
        totalAmount += totalPrice;
        
        validatedItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: totalPrice.toString(),
          notes: item.notes || null,
        });
      }
      
      const order = await storage.createOrder(
        {
          ...validatedOrder,
          totalAmount: totalAmount.toString(),
        },
        validatedItems
      );
      
      // Broadcast new order to restaurant dashboard
      broadcast({
        type: 'new_order',
        order,
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!["pending", "preparing", "ready", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(req.params.id, status);
      
      // Broadcast order status update
      broadcast({
        type: 'order_status_update',
        orderId: req.params.id,
        status,
      });
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Menu item management routes
  app.post("/api/restaurants/:restaurantId/menu", async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse({
        ...req.body,
        restaurantId: req.params.restaurantId,
      });
      
      const menuItem = await storage.createMenuItem(itemData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.patch("/api/menu/:id", async (req, res) => {
    try {
      const updates = req.body;
      const menuItem = await storage.updateMenuItem(req.params.id, updates);
      res.json(menuItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  return httpServer;
}
