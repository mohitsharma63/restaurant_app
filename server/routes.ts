import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertOrderSchema, insertQrCodeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time order updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  function broadcastToClients(message: any) {
    const messageString = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Menu routes
  app.get("/api/restaurants/:restaurantId/menu", async (req, res) => {
    try {
      const menuItems = await storage.getMenuItemsByRestaurant(req.params.restaurantId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const { restaurantId } = req.query;
      let orders;
      
      if (restaurantId) {
        orders = await storage.getOrdersByRestaurant(restaurantId as string);
      } else {
        orders = await storage.getAllOrders();
      }
      
      res.json(orders);
    } catch (error) {
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
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Broadcast new order to all connected clients
      broadcastToClients({
        type: 'new_order',
        order
      });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error: error.message });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Broadcast order status update to all connected clients
      broadcastToClients({
        type: 'order_status_update',
        orderId: order.id,
        status: order.status,
        order
      });
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // QR Code routes
  app.get("/api/restaurants/:restaurantId/qr-codes", async (req, res) => {
    try {
      const qrCodes = await storage.getQrCodesByRestaurant(req.params.restaurantId);
      res.json(qrCodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch QR codes" });
    }
  });

  app.post("/api/qr-codes", async (req, res) => {
    try {
      const validatedData = insertQrCodeSchema.parse(req.body);
      const qrCode = await storage.createQrCode(validatedData);
      res.status(201).json(qrCode);
    } catch (error) {
      res.status(400).json({ message: "Invalid QR code data", error: error.message });
    }
  });

  app.get("/api/qr-codes/:restaurantId/:tableNumber", async (req, res) => {
    try {
      const { restaurantId, tableNumber } = req.params;
      const qrCode = await storage.getQrCodeByTableAndRestaurant(
        restaurantId, 
        parseInt(tableNumber)
      );
      
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }
      
      res.json(qrCode);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch QR code" });
    }
  });

  return httpServer;
}
