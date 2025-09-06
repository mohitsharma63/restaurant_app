import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertRestaurantSchema, insertTableSchema, insertCategorySchema, insertMenuItemSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Restaurant routes
  app.get("/api/restaurants/mine", requireAuth, async (req, res, next) => {
    try {
      const restaurant = await storage.getRestaurantByOwnerId(req.user!.id);
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/restaurants", requireAuth, async (req, res, next) => {
    try {
      const result = insertRestaurantSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid restaurant data" });
      }

      const restaurant = await storage.createRestaurant({
        ...result.data,
        ownerId: req.user!.id,
      });
      res.status(201).json(restaurant);
    } catch (error) {
      next(error);
    }
  });

  // Table routes
  app.get("/api/restaurants/:restaurantId/tables", requireAuth, async (req, res, next) => {
    try {
      const tables = await storage.getTablesByRestaurant(req.params.restaurantId);
      res.json(tables);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/restaurants/:restaurantId/tables", requireAuth, async (req, res, next) => {
    try {
      const result = insertTableSchema.safeParse({
        ...req.body,
        restaurantId: req.params.restaurantId,
      });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid table data" });
      }

      const table = await storage.createTable(result.data);
      res.status(201).json(table);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tables/qr/:qrCode", async (req, res, next) => {
    try {
      const table = await storage.getTableByQrCode(req.params.qrCode);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      res.json(table);
    } catch (error) {
      next(error);
    }
  });

  // Category routes
  app.get("/api/restaurants/:restaurantId/categories", async (req, res, next) => {
    try {
      const categories = await storage.getCategoriesByRestaurant(req.params.restaurantId);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/restaurants/:restaurantId/categories", requireAuth, async (req, res, next) => {
    try {
      const result = insertCategorySchema.safeParse({
        ...req.body,
        restaurantId: req.params.restaurantId,
      });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid category data" });
      }

      const category = await storage.createCategory(result.data);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  });

  // Menu item routes
  app.get("/api/restaurants/:restaurantId/menu-items", async (req, res, next) => {
    try {
      const menuItems = await storage.getMenuItemsByRestaurant(req.params.restaurantId);
      res.json(menuItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/restaurants/:restaurantId/menu-items", requireAuth, async (req, res, next) => {
    try {
      const result = insertMenuItemSchema.safeParse({
        ...req.body,
        restaurantId: req.params.restaurantId,
      });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid menu item data" });
      }

      const menuItem = await storage.createMenuItem(result.data);
      res.status(201).json(menuItem);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/menu-items/:id", requireAuth, async (req, res, next) => {
    try {
      const menuItem = await storage.updateMenuItem(req.params.id, req.body);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      next(error);
    }
  });

  // Order routes
  app.get("/api/restaurants/:restaurantId/orders", requireAuth, async (req, res, next) => {
    try {
      const orders = await storage.getOrdersByRestaurant(req.params.restaurantId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", async (req, res, next) => {
    try {
      const result = insertOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      const order = await storage.createOrder(result.data);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:orderId", async (req, res, next) => {
    try {
      const order = await storage.getOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/orders/:orderId/status", requireAuth, async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.orderId, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  // Order item routes
  app.get("/api/orders/:orderId/items", async (req, res, next) => {
    try {
      const items = await storage.getOrderItemsByOrder(req.params.orderId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders/:orderId/items", async (req, res, next) => {
    try {
      const result = insertOrderItemSchema.safeParse({
        ...req.body,
        orderId: req.params.orderId,
      });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid order item data" });
      }

      const orderItem = await storage.createOrderItem(result.data);
      res.status(201).json(orderItem);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
