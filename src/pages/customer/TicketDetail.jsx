import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicket, fetchMessages, sendMessage, clearCurrentTicket } from '../../redux/ticketSlice.js';

const TicketDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTicket, messages, isLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('🔄 LOADING TICKET:', id);
    dispatch(fetchTicket(id));
    dispatch(fetchMessages(id));
    return () => dispatch(clearCurrentTicket());
  }, [dispatch, id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log('📤 SENDING MESSAGE:', newMessage);
    await dispatch(sendMessage({ ticketId: id, message: newMessage.trim() }));
    setNewMessage('');
    dispatch(fetchMessages(id));
  };

  if (isLoading || !currentTicket) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading ticket...</h2>
      </div>
    );
  }

  console.log('✅ TICKET LOADED:', currentTicket);
  console.log('💬 MESSAGES:', messages);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Back Button */}
      <Link to="/customer/tickets" style={{ color: 'blue', textDecoration: 'none' }}>
        ← Back to Tickets
      </Link>

      {/* Ticket Info */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '16px',
        marginBottom: '16px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentTicket.subject}</h1>
        <p style={{ color: '#666' }}>#{currentTicket.ticketNumber}</p>
        <p>Status: <strong>{currentTicket.status}</strong></p>
        <p>Priority: <strong>{currentTicket.priority}</strong></p>
        <p>Category: <strong>{currentTicket.category}</strong></p>
        <p style={{ marginTop: '12px' }}>{currentTicket.description}</p>
        {currentTicket.resolutionNote && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
            <p><strong>Resolution:</strong> {currentTicket.resolutionNote}</p>
          </div>
        )}
      </div>

      {/* ⭐ CHAT SECTION */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
          💬 Messages ({messages.length})
        </h2>

        {/* Messages */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '16px' }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id;
              return (
                <div
                  key={msg._id}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    marginBottom: '8px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: isOwn ? '#4f46e5' : '#f3f4f6',
                      color: isOwn ? 'white' : '#111827'
                    }}
                  >
                    <p style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {isOwn ? 'You' : msg.sender?.name || 'Unknown'}
                    </p>
                    <p>{msg.message}</p>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Message */}
        {currentTicket.status === 'Resolved' ? (
          <p style={{ textAlign: 'center', color: 'green', padding: '8px' }}>
            ✅ Ticket resolved. No more messages allowed.
          </p>
        ) : (
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                padding: '10px 20px',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;