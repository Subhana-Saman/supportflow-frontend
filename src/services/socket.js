import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    // Socket.IO is disabled on the Vercel production deployment.
    // It remains available during local development.
    if (import.meta.env.PROD) {
      console.log('🔌 Socket.IO disabled in production');
      return null;
    }

    // Avoid opening a second connection if one is already active.
    if (this.socket?.connected) {
      return this.socket;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      withCredentials: true,
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

    this.socket.on('messageReceived', (data) => {
      if (this.listeners.onMessage) {
        this.listeners.onMessage(data);
      }
    });

    this.socket.on('ticketStatusUpdated', (data) => {
      if (this.listeners.onTicketUpdate) {
        this.listeners.onTicketUpdate(data);
      }
    });

    this.socket.on('userTyping', (data) => {
      if (this.listeners.onTyping) {
        this.listeners.onTyping(data);
      }
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);

      if (this.listeners.onError) {
        this.listeners.onError(data);
      }
    });
  }

  joinTicket(ticketId) {
    if (this.socket?.connected) {
      this.socket.emit('joinTicket', ticketId);
    }
  }

  leaveTicket(ticketId) {
    if (this.socket?.connected) {
      this.socket.emit('leaveTicket', ticketId);
    }
  }

  sendMessage(ticketId, message) {
    if (this.socket?.connected) {
      this.socket.emit('newMessage', {
        ticketId,
        message,
      });
    }
  }

  sendTyping(ticketId, isTyping) {
    if (this.socket?.connected) {
      this.socket.emit('typing', {
        ticketId,
        isTyping,
      });
    }
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  off(event) {
    delete this.listeners[event];
  }
}

export default new SocketService();