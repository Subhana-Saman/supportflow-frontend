import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../redux/ticketSlice.js';
import { Users, Ticket, CheckCircle, Clock, AlertCircle, BarChart3, Timer, Zap } from 'lucide-react';
import { formatMinutes } from '../../utils/helpers.js';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Fixed palette so colors stay consistent between renders/legend
const CATEGORY_COLORS = ['#6366f1', '#06b6d4', '#f97316', '#10b981', '#f43f5e', '#94a3b8'];
const PRIORITY_COLORS = { Low: '#22c55e', Medium: '#eab308', High: '#ef4444' };

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

      {/* SLA — Average response & resolution time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-700/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Zap className="text-white" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. First Response Time</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatMinutes(stats?.avgResponseTimeMinutes)}
            </p>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-700/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Timer className="text-white" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Resolution Time</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatMinutes(stats?.avgResolutionTimeMinutes)}
            </p>
          </div>
        </div>
      </div>

      {stats?.ticketsByCategory && stats.ticketsByCategory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tickets by Category — Pie chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tickets by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.ticketsByCategory}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ _id, count }) => `${_id}: ${count}`}
                >
                  {stats.ticketsByCategory.map((entry, index) => (
                    <Cell key={entry._id} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tickets by Priority — Bar chart */}
          {stats?.ticketsByPriority && stats.ticketsByPriority.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tickets by Priority</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.ticketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.ticketsByPriority.map((entry) => (
                      <Cell key={entry._id} fill={PRIORITY_COLORS[entry._id] || '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tickets by Status — Bar chart */}
          {stats?.ticketsByStatus && stats.ticketsByStatus.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tickets by Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.ticketsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Agent Workload — Bar chart */}
          {stats?.agentWorkload && stats.agentWorkload.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Agent Workload (active tickets)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.agentWorkload} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="activeTickets" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;