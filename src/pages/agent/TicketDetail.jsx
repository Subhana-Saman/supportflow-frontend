import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTicket, 
  fetchMessages, 
  sendMessage,
  updateTicket,
  resolveTicket,
  clearCurrentTicket 
} from '../../redux/ticketSlice.js';

const AgentTicketDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTicket, messages, isLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolve, setShowResolve] = useState(false);

  useEffect(() => {
    console.log('🔄 Loading ticket detail for ID:', id);
    dispatch(fetchTicket(id));
    dispatch(fetchMessages(id));
    
    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await dispatch(sendMessage({ 
        ticketId: id, 
        message: newMessage.trim() 
      }));
      setNewMessage('');
      dispatch(fetchMessages(id));
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status) => {
    await dispatch(updateTicket({ id, data: { status } }));
    dispatch(fetchTicket(id));
  };

  const handleResolve = async () => {
    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note!');
      return;
    }
    await dispatch(resolveTicket({ id, resolutionNote }));
    setShowResolve(false);
    setResolutionNote('');
    dispatch(fetchTicket(id));
  };

  if (isLoading || !currentTicket) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  const isResolved = currentTicket.status === 'Resolved';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/agent/tickets" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        ← Back to Tickets
      </Link>

      {/* Ticket Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentTicket.subject}
            </h1>
            <p className="text-sm text-gray-500">Ticket #{currentTicket.ticketNumber}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700">
              {currentTicket.category}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${
              currentTicket.priority === 'High' ? 'bg-red-200 text-red-800' :
              currentTicket.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
              'bg-green-200 text-green-800'
            }`}>
              {currentTicket.priority}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${
              currentTicket.status === 'Resolved' ? 'bg-green-200 text-green-800' :
              currentTicket.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {currentTicket.status}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Customer</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {currentTicket.customer?.name || 'Unknown'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {currentTicket.customer?.email}
            </p>
          </div>
          {currentTicket.assignedAgent && (
            <div>
              <p className="text-gray-500">Assigned Agent</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {currentTicket.assignedAgent.name}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">{currentTicket.description}</p>
        </div>

        {currentTicket.resolutionNote && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Resolution Note:</p>
            <p className="text-green-600 dark:text-green-400">{currentTicket.resolutionNote}</p>
          </div>
        )}
      </div>

      {/* Agent Actions */}
      {!isResolved && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('New')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              New
            </button>
            <button
              onClick={() => handleStatusChange('Assigned')}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Assigned
            </button>
            <button
              onClick={() => handleStatusChange('In Progress')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              In Progress
            </button>
            <button
              onClick={() => setShowResolve(!showResolve)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Resolve
            </button>
          </div>

          {showResolve && (
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter resolution note..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleResolve}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowResolve(false);
                  setResolutionNote('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* ⭐⭐⭐ CHAT SECTION ⭐⭐⭐ */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💬 Conversation
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by replying below</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {isOwn ? 'You' : msg.sender?.name || 'Unknown'}
                      {msg.sender?.role === 'agent' && !isOwn && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                          Agent
                        </span>
                      )}
                    </p>
                    <p className="mt-1">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isResolved ? (
          <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-green-600 dark:text-green-400">
              ✅ This ticket has been resolved. Replies are disabled.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgentTicketDetail;