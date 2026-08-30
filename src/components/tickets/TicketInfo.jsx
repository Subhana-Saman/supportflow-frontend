import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { User, Mail, Calendar, MessageSquare, CheckCircle, Edit, Send } from 'lucide-react';
import { getStatusColor, getPriorityColor, getCategoryColor } from '../../utils/helpers.js';

const TicketInfo = ({ ticket, userRole, onUpdate, onAssign, onResolve }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [formData, setFormData] = useState({
    category: ticket?.category || '',
    priority: ticket?.priority || '',
    status: ticket?.status || '',
  });
  const { users } = useSelector((state) => state.users || { users: [] });
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Filter agents from users list
    const agentList = users?.filter(u => u.role === 'agent') || [];
    setAgents(agentList);
  }, [users]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(formData);
      setIsEditing(false);
    }
  };

  const handleResolve = () => {
    if (onResolve && resolutionNote.trim()) {
      onResolve(resolutionNote);
      setIsResolving(false);
      setResolutionNote('');
    }
  };

  const canEdit = userRole === 'agent' || userRole === 'admin';
  const isResolved = ticket?.status === 'Resolved';

  return (
    <div className="card p-4 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">Ticket Details</h3>

      {/* Customer Info */}
      <div className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        <p className="text-sm text-gray-500">Customer</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600">
            {ticket?.customer?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket?.customer?.name}</p>
            <p className="text-xs text-gray-500">{ticket?.customer?.email}</p>
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Category</p>
          {isEditing && canEdit ? (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Order">Order</option>
              <option value="Refund">Refund</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <span className={`badge ${getCategoryColor(ticket?.category)} mt-1 inline-block`}>
              {ticket?.category}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Priority</p>
          {isEditing && canEdit ? (
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          ) : (
            <span className={`badge ${getPriorityColor(ticket?.priority)} mt-1 inline-block`}>
              {ticket?.priority}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          {isEditing && canEdit && !isResolved ? (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          ) : (
            <span className={`badge ${getStatusColor(ticket?.status)} mt-1 inline-block`}>
              {ticket?.status}
            </span>
          )}
        </div>

        {ticket?.assignedAgent && (
          <div>
            <p className="text-sm text-gray-500">Assigned Agent</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {ticket.assignedAgent.name}
            </p>
          </div>
        )}

        {ticket?.createdAt && (
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </p>
          </div>
        )}

        {ticket?.resolvedAt && (
          <div>
            <p className="text-sm text-gray-500">Resolved</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(new Date(ticket.resolvedAt), { addSuffix: true })}
            </p>
          </div>
        )}

        {ticket?.resolutionNote && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Resolution Note</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.resolutionNote}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {canEdit && !isResolved && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full btn btn-secondary flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit Ticket
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleUpdate}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full btn btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {!isResolving ? (
            <button
              onClick={() => setIsResolving(true)}
              className="w-full btn btn-success flex items-center justify-center gap-2"
              disabled={isResolved}
            >
              <CheckCircle size={16} />
              Resolve Ticket
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter resolution note..."
                className="input min-h-[80px]"
                required
              />
              <button
                onClick={handleResolve}
                className="w-full btn btn-success flex items-center justify-center gap-2"
                disabled={!resolutionNote.trim()}
              >
                <CheckCircle size={16} />
                Confirm Resolution
              </button>
              <button
                onClick={() => setIsResolving(false)}
                className="w-full btn btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketInfo;