import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tickets', ticketData);
      toast.success('Ticket created successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchTickets = createAsyncThunk(
  'tickets/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/tickets', { params });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tickets';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchTicket = createAsyncThunk(
  'tickets/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tickets/${id}`, data);
      toast.success('Ticket updated successfully');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assign',
  async ({ id, agentId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tickets/${id}/assign`, { agentId });
      toast.success('Ticket assigned successfully');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resolveTicket = createAsyncThunk(
  'tickets/resolve',
  async ({ id, resolutionNote }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tickets/${id}/resolve`, { resolutionNote });
      toast.success('Ticket resolved successfully!');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resolve ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const cancelTicket = createAsyncThunk(
  'tickets/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tickets/${id}/cancel`);
      toast.success('Ticket cancelled');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const reopenTicket = createAsyncThunk(
  'tickets/reopen',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tickets/${id}/reopen`);
      toast.success('Ticket reopened');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reopen ticket';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'tickets/fetchMessages',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/messages`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch messages';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'tickets/sendMessage',
  async ({ ticketId, message, attachment }, { rejectWithValue }) => {
    try {
      let response;
      if (attachment) {
        // File present — send as multipart/form-data instead of JSON
        const formData = new FormData();
        if (message) formData.append('message', message);
        formData.append('attachment', attachment);
        response = await api.post(`/tickets/${ticketId}/messages`, formData, {
          headers: { 'Content-Type': undefined } // let the browser set the multipart boundary
        });
      } else {
        response = await api.post(`/tickets/${ticketId}/messages`, { message });
      }
      toast.success('Message sent');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  'tickets/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      return rejectWithValue(message);
    }
  }
);

export const fetchActivity = createAsyncThunk(
  'tickets/fetchActivity',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tickets/${ticketId}/activity`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activity';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  tickets: [],
  currentTicket: null,
  messages: [],
  activity: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.messages = [];
      state.activity = [];
    },
    addMessage: (state, action) => {
      // A message can arrive both from our own REST response and from the
      // real-time socket broadcast (the server echoes it back to everyone
      // in the room, including the sender). De-dupe by _id so it only
      // shows up once in the conversation.
      const exists = state.messages.some((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateTicketStatus: (state, action) => {
      const { ticketId, status } = action.payload;
      const ticket = state.tickets.find(t => t._id === ticketId);
      if (ticket) ticket.status = status;
      if (state.currentTicket && state.currentTicket._id === ticketId) {
        state.currentTicket.status = status;
      }
    },
    // Applied when a full, updated ticket arrives via the
    // 'ticketStatusUpdated' socket event (status/category/priority/
    // assignment changed by the other party) so the UI updates instantly.
    applyRealtimeTicketUpdate: (state, action) => {
      const updatedTicket = action.payload;
      if (!updatedTicket?._id) return;
      const index = state.tickets.findIndex((t) => t._id === updatedTicket._id);
      if (index !== -1) state.tickets[index] = updatedTicket;
      if (state.currentTicket && state.currentTicket._id === updatedTicket._id) {
        state.currentTicket = updatedTicket;
      }
    },
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload.tickets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Ticket
      .addCase(fetchTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket && state.currentTicket._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      // Assign Ticket
      .addCase(assignTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket && state.currentTicket._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      // Resolve Ticket
      .addCase(resolveTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket && state.currentTicket._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      // Cancel Ticket
      .addCase(cancelTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket && state.currentTicket._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      // Reopen Ticket
      .addCase(reopenTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
        if (state.currentTicket && state.currentTicket._id === action.payload._id) {
          state.currentTicket = action.payload;
        }
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        // The server broadcasts the new message over the socket to
        // everyone in the room, including the sender, right after saving
        // it. That socket event can arrive (and get added via addMessage)
        // before this REST response resolves. Guard against pushing the
        // same message twice.
        const exists = state.messages.some((m) => m._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      // Fetch Activity
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.activity = action.payload;
      })
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearCurrentTicket, 
  addMessage, 
  updateTicketStatus,
  applyRealtimeTicketUpdate,
  setCurrentTicket 
} = ticketSlice.actions;

export default ticketSlice.reducer;