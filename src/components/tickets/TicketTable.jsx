import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getStatusColor, getPriorityColor, getCategoryColor } from '../../utils/helpers.js';

const TicketTable = ({ tickets }) => {
  // The "View" link must point to a route the *currently logged-in user*
  // is allowed to visit (e.g. an agent needs /agent/tickets/:id), not a
  // route based on the ticket's customer's role — using the customer's
  // role here was sending agents/admins to a customer-only route, which
  // ProtectedRoute then bounced them away from.
  const { user } = useSelector((state) => state.auth);

  const getRolePath = (role) => {
    const paths = {
      customer: '/customer/tickets',
      agent: '/agent/tickets',
      admin: '/admin/tickets',
    };
    return paths[role] || '/tickets';
  };

  return (
    <>
      {/* Mobile: stacked cards (below sm). Avoids the cramped, horizontally
          scrolling table that used to be the only layout on small screens. */}
      <div className="space-y-3 sm:hidden">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            to={`${getRolePath(user?.role)}/${ticket._id}`}
            className="block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-4 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {ticket.ticketNumber}
                </span>
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {ticket.subject}
                </h3>
              </div>
              <span className={`badge shrink-0 ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`badge ${getCategoryColor(ticket.category)}`}>{ticket.category}</span>
              <span className={`badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{ticket.customer?.name || 'N/A'}</span>
              <span>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet and up: original table, unchanged */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Updated</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-4 text-sm font-medium text-primary-600 dark:text-primary-400">
                  {ticket.ticketNumber}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                  {ticket.subject}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                  {ticket.customer?.name || 'N/A'}
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className={`badge ${getCategoryColor(ticket.category)}`}>{ticket.category}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </td>
                <td className="py-3 px-4">
                  <Link 
                    to={`${getRolePath(user?.role)}/${ticket._id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TicketTable;