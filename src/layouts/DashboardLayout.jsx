import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  User, 
  Users, 
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { logout } from '../redux/authSlice.js';

const DashboardLayout = () => {
  // Sidebar should start OPEN on desktop/tablet (lg and up) but CLOSED on
  // mobile. Previously this always started `true`, so on phones the
  // sidebar + its dark overlay covered the whole screen on every page
  // load until the user tapped to dismiss it — that's what was making
  // every dashboard page (not just Tickets) look broken on mobile.
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const getNavigation = () => {
    const role = user?.role || 'customer';
    
    const baseItems = [
      { path: `/${role}/dashboard`, icon: LayoutDashboard, label: 'Dashboard' },
      { path: `/${role}/tickets`, icon: Ticket, label: 'Tickets' },
    ];
    
    if (role === 'customer') {
      return [
        ...baseItems,
        { path: '/customer/tickets/create', icon: PlusCircle, label: 'New Ticket' },
        { path: '/customer/profile', icon: User, label: 'Profile' },
      ];
    }
    
    if (role === 'agent') {
      return [
        ...baseItems,
        { path: '/agent/profile', icon: User, label: 'Profile' },
      ];
    }
    
    if (role === 'admin') {
      return [
        ...baseItems,
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/profile', icon: User, label: 'Profile' },
      ];
    }
    
    return baseItems;
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SupportFlow
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">v2.0</p>
            </div>
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 mx-3 my-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </button>
            );
          })}
          
          {/* Logout */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <p className="text-xs font-medium">Need help?</p>
            </div>
            <p className="text-xs opacity-90 mt-1">Contact support 24/7</p>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Menu size={22} />
              </button>

              {/* Back/Forward */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Page Title */}
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden md:block">
                {navigation.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg shadow-red-500/25">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 ml-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/25">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="px-4 pb-3">
              <input
                type="text"
                placeholder="Search tickets, customers..."
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;