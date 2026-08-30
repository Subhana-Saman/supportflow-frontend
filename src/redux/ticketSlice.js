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
  async ({ ticketId, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/tickets/${ticketId}/messages`, { message });
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

const initialState = {
  tickets: [],
  currentTicket: null,
  messages: [],
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
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateTicketStatus: (state, action) => {
      const { ticketId, status } = action.payload;
      const ticket = state.tickets.find(t => t._id === ticketId);
      if (ticket) ticket.status = status;
      if (state.currentTicket && state.currentTicket._id === ticketId) {
        state.currentTicket.status = status;
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
        state.messages.push(action.payload);
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
  setCurrentTicket 
} = ticketSlice.actions;

export default ticketSlice.reducer;