import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this._loggedError = false;
  }

  connect(token) {
    // Socket.IO real-time connections are disabled: this backend runs on Vercel
    // serverless functions, which don't support persistent WebSocket/long-polling
    // connections. Attempting to connect here only produces failed handshake
    // errors in the browser console with no way to recover. All messaging and
    // ticket updates already work over the REST API (see ticketSlice.js), so
    // this is a safe no-op — nothing in the app currently relies on socket events.
    return null;
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
      this._loggedError = false;
    });

    this.socket.on('connect_error', () => {
      // The real-time layer is optional — chat/tickets still work over REST.
      // Log once per session instead of spamming the console on every retry.
      if (!this._loggedError) {
        console.warn('Real-time connection unavailable — falling back to standard updates.');
        this._loggedError = true;
      }
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