import { useEffect, useRef } from "react";

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log("WebSocket connected");
          onConnect?.();
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage?.(data);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log("WebSocket disconnected");
          onDisconnect?.();
          
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000);
        };
        
        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          onError?.(error);
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onMessage, onConnect, onDisconnect, onError]);

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return {
    sendMessage,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  };
}
