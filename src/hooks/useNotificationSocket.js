import { useEffect, useRef } from 'react';

/**
 * Opens a raw WebSocket to the backend's notifications consumer
 * (ws/notifications/, see notifications/consumers.py) and invokes
 * onNotification for every push the server sends. Mirrors the connection
 * pattern already used for chat in useChat.js (token passed as a query
 * param, since the browser can't attach an Authorization header to a
 * WebSocket handshake).
 *
 * @param {(notification: object) => void} onNotification
 */
const useNotificationSocket = (onNotification) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return undefined;

    let closedByCleanup = false;

    const connect = () => {
      const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8001';
      const wsUrl = `${WS_BASE_URL}/notifications/?token=${token}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification' && data.notification) {
            onNotificationRef.current?.(data.notification);
          }
        } catch (err) {
          console.error('Failed to parse notification payload:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('Notification WebSocket error:', error);
      };

      ws.onclose = () => {
        if (!closedByCleanup) {
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      closedByCleanup = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);
};

export default useNotificationSocket;
