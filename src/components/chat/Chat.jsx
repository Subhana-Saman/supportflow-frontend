import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { sendMessage, addMessage } from '../../redux/ticketSlice.js';
import socketService from '../../services/socket.js';

const Chat = ({ ticketId, messages, currentUser, status }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Setup socket listeners for this ticket
    socketService.joinTicket(ticketId);

    socketService.on('onMessage', (data) => {
      if (data.ticketId === ticketId) {
        dispatch(addMessage(data.message));
      }
    });

    socketService.on('onTyping', (data) => {
      if (data.userId !== currentUser._id) {
        setTypingUser(data.userName);
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socketService.leaveTicket(ticketId);
      socketService.off('onMessage');
      socketService.off('onTyping');
    };
  }, [ticketId, currentUser._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending || status === 'Resolved') return;

    setIsSending(true);
    try {
      // Sent via REST; the server broadcasts it over the socket to the
      // room (including us), and `addMessage` de-dupes by _id, so we must
      // NOT also emit it over the socket ourselves — that would create a
      // second Message document in the database for the same send.
      const result = await dispatch(sendMessage({ ticketId, message: message.trim() }));
      if (result.meta.requestStatus === 'fulfilled') {
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socketService.sendTyping(ticketId, e.target.value.length > 0);
  };

  const isResolved = status === 'Resolved';

  return (
    <div className="card flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender?._id === currentUser?._id;
            const senderName = isOwn ? 'You' : msg.sender?.name || 'Unknown';
            const isAgent = msg.sender?.role === 'agent' || msg.sender?.role === 'admin';

            return (
              <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {senderName}
                    </span>
                    {isAgent && !isOwn && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        Agent
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </span>
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    isOwn 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTyping && typingUser && (
          <div className="flex justify-start">
            <div className="max-w-[70%]">
              <div className="text-xs text-gray-500 mb-1">{typingUser} is typing...</div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {isResolved ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-2">
            This ticket has been resolved. Replies are disabled.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="input flex-1"
              disabled={isSending || isResolved}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending || isResolved}
              className="btn btn-primary px-4 disabled:opacity-50"
            >
              {isSending ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;