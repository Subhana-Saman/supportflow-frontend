import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { getStatusColor, getPriorityColor, getCategoryColor } from '../../utils/helpers.js';

const TicketTable = ({ tickets }) => {
  const getRolePath = (role) => {
    const paths = {
      customer: '/customer/tickets',
      agent: '/agent/tickets',
      admin: '/admin/tickets',
    };
    return paths[role] || '/tickets';
  };

  return (
    <div className="overflow-x-auto">
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
                  to={`${getRolePath(ticket.customer?.role)}/${ticket._id}`}
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
  );
};

export default TicketTable;