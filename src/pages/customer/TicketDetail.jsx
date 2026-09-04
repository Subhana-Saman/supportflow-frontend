import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicket, fetchMessages, sendMessage, clearCurrentTicket, cancelTicket, reopenTicket, fetchActivity } from '../../redux/ticketSlice.js';

const TicketDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTicket, messages, activity, isLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    dispatch(fetchTicket(id));
    dispatch(fetchMessages(id));
    dispatch(fetchActivity(id));
    return () => dispatch(clearCurrentTicket());
  }, [dispatch, id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;
    await dispatch(sendMessage({ ticketId: id, message: newMessage.trim(), attachment }));
    setNewMessage('');
    setAttachment(null);
    dispatch(fetchMessages(id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      e.target.value = '';
      return;
    }
    setAttachment(file);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      dispatch(cancelTicket(id)).then(() => dispatch(fetchActivity(id)));
    }
  };

  const handleReopen = () => {
    if (window.confirm('Reopen this ticket? Its status will move back to "In Progress".')) {
      dispatch(reopenTicket(id)).then(() => dispatch(fetchActivity(id)));
    }
  };

  if (isLoading || !currentTicket) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading ticket...</h2>
      </div>
    );
  }

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
        {currentTicket.firstResponseAt && (
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
            ⚡ First response: {new Date(currentTicket.firstResponseAt).toLocaleString()}
          </p>
        )}
        {currentTicket.resolutionNote && (
          <div style={{ marginTop: '12px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
            <p><strong>Resolution:</strong> {currentTicket.resolutionNote}</p>
          </div>
        )}

        {/* Cancel: only while ticket is still New (not yet picked up) */}
        {currentTicket.status === 'New' && (
          <button
            onClick={handleCancel}
            style={{
              marginTop: '16px',
              padding: '10px 18px',
              background: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Cancel Ticket
          </button>
        )}

        {/* Reopen: only once resolved */}
        {currentTicket.status === 'Resolved' && (
          <button
            onClick={handleReopen}
            style={{
              marginTop: '16px',
              padding: '10px 18px',
              background: '#e0e7ff',
              color: '#4338ca',
              border: '1px solid #a5b4fc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reopen Ticket
          </button>
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
                    {msg.message && <p>{msg.message}</p>}
                    {msg.attachment?.fileUrl && (
                      msg.attachment.fileType?.startsWith('image/') ? (
                        <a href={msg.attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={msg.attachment.fileUrl}
                            alt={msg.attachment.fileName}
                            style={{ maxWidth: '220px', borderRadius: '8px', marginTop: '6px', display: 'block' }}
                          />
                        </a>
                      ) : (
                        
                         <a href={msg.attachment.fileUrl}
                          download={msg.attachment.fileName}
                          style={{
                            display: 'inline-block',
                            marginTop: '6px',
                            padding: '8px 12px',
                            background: isOwn ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                            borderRadius: '6px',
                            color: 'inherit',
                            fontSize: '13px',
                            textDecoration: 'none'
                          }}
                        >
                          📎 {msg.attachment.fileName}
                        </a>
                      )
                    )}
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
        ) : currentTicket.status === 'Cancelled' ? (
          <p style={{ textAlign: 'center', color: '#b91c1c', padding: '8px' }}>
            🚫 Ticket cancelled. No more messages allowed.
          </p>
        ) : (
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attachment && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#f3f4f6', padding: '8px 12px', borderRadius: '8px', fontSize: '13px'
              }}>
                <span>📎 {attachment.name}</span>
                <button type="button" onClick={() => setAttachment(null)} style={{ border: 'none', background: 'none', color: '#b91c1c', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
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
              <label
                style={{
                  padding: '10px 14px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📎
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <button
                type="submit"
                disabled={!newMessage.trim() && !attachment}
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
            </div>
          </form>
        )}
      </div>

      {/* ⭐ ACTIVITY TIMELINE */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '16px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
          🕒 Activity Timeline
        </h2>

        {activity.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '12px' }}>
            No activity recorded yet.
          </p>
        ) : (
          <div style={{ borderLeft: '2px solid #e5e7eb', marginLeft: '8px' }}>
            {activity.map((entry) => (
              <div key={entry._id} style={{ position: 'relative', paddingLeft: '20px', paddingBottom: '18px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '-7px',
                    top: '2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#4f46e5',
                    border: '2px solid white'
                  }}
                />
                <p style={{ fontSize: '14px', color: '#111827' }}>{entry.description}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {entry.actor?.name || 'System'} · {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;