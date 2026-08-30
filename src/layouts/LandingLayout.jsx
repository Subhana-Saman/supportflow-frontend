import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, ArrowRight, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SupportFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Support tickets.
              <br />
              <span className="text-primary-600">Simplified.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Manage customer conversations, track issues, and resolve support requests faster with our modern ticketing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                Get Started Free
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything you need for great support
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ticket Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Create, track, and resolve support tickets with ease.</p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-Time Chat</h3>
              <p className="text-gray-600 dark:text-gray-400">Communicate with customers instantly using WebSockets.</p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-400">JWT-based authentication with HTTP-only cookies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How SupportFlow works
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-600">1</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Create Ticket</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer submits a support request</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-600">2</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Assign Agent</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ticket gets assigned to an agent</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-600">3</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Communicate</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time conversation happens</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-600">4</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Resolve</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ticket is resolved and closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to streamline support?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of teams using SupportFlow every day.</p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <p>© 2024 SupportFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;