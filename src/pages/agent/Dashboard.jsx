import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStats, fetchTickets } from '../../redux/ticketSlice.js';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight  // ⭐ ADD THIS
} from 'lucide-react';
import TicketCard from '../../components/tickets/TicketCard.jsx';

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const { stats, tickets } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchTickets({ limit: 5 }));
  }, [dispatch]);

  const statCards = [
    { title: 'Total Tickets', value: stats?.totalTickets || 0, icon: Ticket, gradient: 'from-blue-500 to-blue-600' },
    { title: 'New', value: stats?.newTickets || 0, icon: AlertCircle, gradient: 'from-red-500 to-red-600' },
    { title: 'In Progress', value: stats?.inProgressTickets || 0, icon: Clock, gradient: 'from-purple-500 to-purple-600' },
    { title: 'Resolved', value: stats?.resolvedTickets || 0, icon: CheckCircle, gradient: 'from-green-500 to-green-600' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl shadow-blue-500/25">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 mt-1">Here's what's happening with your support tickets today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-white" size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tickets</h2>
          <Link to="/agent/tickets" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
        {tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Ticket className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tickets assigned</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;