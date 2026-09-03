import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    // Avoid opening a second connection if one is already active.
    if (this.socket?.connected) return this.socket;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      // The JWT lives in an HTTP-only cookie (not readable from JS), so we
      // authenticate the socket the same way our REST calls do: by sending
      // the cookie automatically. The server reads it from the handshake.
      withCredentials: true,
      // Try polling first, then upgrade to websocket if possible. On
      // serverless hosts (e.g. Vercel) persistent WebSocket connections can
      // be unreliable, so polling as a fallback keeps chat/status updates
      // working even when the websocket upgrade fails.
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Message events
    this.socket.on('messageReceived', (data) => {
      if (this.listeners.onMessage) {
        this.listeners.onMessage(data);
      }
    });

    // Ticket events
    this.socket.on('ticketStatusUpdated', (data) => {
      if (this.listeners.onTicketUpdate) {
        this.listeners.onTicketUpdate(data);
      }
    });

    // Typing events
    this.socket.on('userTyping', (data) => {
      if (this.listeners.onTyping) {
        this.listeners.onTyping(data);
      }
    });

    // Error events
    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      if (this.listeners.onError) {
        this.listeners.onError(data);
      }
    });
  }

  // Join a ticket room
  joinTicket(ticketId) {
    if (this.socket) {
      this.socket.emit('joinTicket', ticketId);
    }
  }

  // Leave a ticket room
  leaveTicket(ticketId) {
    if (this.socket) {
      this.socket.emit('leaveTicket', ticketId);
    }
  }

  // Send a message
  sendMessage(ticketId, message) {
    if (this.socket) {
      this.socket.emit('newMessage', { ticketId, message });
    }
  }

  // Typing indicator
  sendTyping(ticketId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', { ticketId, isTyping });
    }
  }

  // Register event listeners
  on(event, callback) {
    this.listeners[event] = callback;
  }

  // Remove event listener
  off(event) {
    delete this.listeners[event];
  }
}

export default new SocketService();