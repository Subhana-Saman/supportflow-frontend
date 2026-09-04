import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getStatusColor, getPriorityColor, getCategoryColor } from '../../utils/helpers.js';
import { ChevronRight } from 'lucide-react';

const TicketCard = ({ ticket }) => {
  // Route to the page the *currently logged-in user* is allowed to see,
  // not a route based on the ticket's customer's role (that sent
  // agents/admins to a customer-only page and got them redirected away).
  const { user } = useSelector((state) => state.auth);

  const getPath = () => {
    const role = user?.role || 'customer';
    if (role === 'customer') return `/customer/tickets/${ticket._id}`;
    if (role === 'agent') return `/agent/tickets/${ticket._id}`;
    if (role === 'admin') return `/admin/tickets/${ticket._id}`;
    return `/tickets/${ticket._id}`;
  };

  return (
    <Link to={getPath()}>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-5 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg whitespace-nowrap shrink-0">
                {ticket.ticketNumber}
              </span>
              <span className={`badge ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mt-2 truncate">{ticket.subject}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${getCategoryColor(ticket.category)}`}>{ticket.category}</span>
            <span className={`badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
          {ticket.customer?.name && (
            <span className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {ticket.customer.name.charAt(0)}
              </div>
              {ticket.customer.name}
            </span>
          )}
          {ticket.assignedAgent?.name && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">→</span>
              {ticket.assignedAgent.name}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            View <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;