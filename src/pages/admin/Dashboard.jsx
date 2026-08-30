import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../redux/ticketSlice.js';
import { Users, Ticket, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const statCards = [
    { title: 'Total Tickets', value: stats?.totalTickets || 0, icon: Ticket, gradient: 'from-blue-500 to-blue-600' },
    { title: 'New', value: stats?.newTickets || 0, icon: AlertCircle, gradient: 'from-red-500 to-red-600' },
    { title: 'In Progress', value: stats?.inProgressTickets || 0, icon: Clock, gradient: 'from-purple-500 to-purple-600' },
    { title: 'Resolved', value: stats?.resolvedTickets || 0, icon: CheckCircle, gradient: 'from-green-500 to-green-600' },
    { title: 'Customers', value: stats?.totalCustomers || 0, icon: Users, gradient: 'from-indigo-500 to-indigo-600' },
    { title: 'Agents', value: stats?.totalAgents || 0, icon: Users, gradient: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl shadow-blue-500/25">
        <h1 className="text-2xl font-bold">Admin Dashboard 👋</h1>
        <p className="text-blue-100 mt-1">Platform overview and analytics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-white" size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.ticketsByCategory && stats.ticketsByCategory.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tickets by Category</h3>
          <div className="space-y-3">
            {stats.ticketsByCategory.map((cat) => (
              <div key={cat._id} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{cat._id}</span>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                    style={{ width: `${(cat.count / stats.totalTickets) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;