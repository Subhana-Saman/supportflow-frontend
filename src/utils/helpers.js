export const getStatusColor = (status) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-700',
    'Assigned': 'bg-purple-100 text-purple-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Resolved': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'bg-green-100 text-green-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'High': 'bg-red-100 text-red-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
};

export const getCategoryColor = (category) => {
  const colors = {
    'Billing': 'bg-emerald-100 text-emerald-700',
    'Technical': 'bg-cyan-100 text-cyan-700',
    'Account': 'bg-indigo-100 text-indigo-700',
    'Order': 'bg-orange-100 text-orange-700',
    'Refund': 'bg-rose-100 text-rose-700',
    'Other': 'bg-gray-100 text-gray-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};