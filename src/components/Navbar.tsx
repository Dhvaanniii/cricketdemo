import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Clock, LogOut } from 'lucide-react';
import { api } from '../lib/api';
import { useEffect, useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkSession();
    // Check session every 30 seconds
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSession = async () => {
    try {
      const session = await api.getSession();
      setIsAdmin(session.isAdmin || false);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsAdmin(false);
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">BPCG</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/book"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/book') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Book Now</span>
            </Link>
            <Link
              to="/pricing"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg font-bold">₹</span>
              <span>Pricing</span>
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/my-bookings"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/my-bookings') ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>My Bookings</span>
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin-login"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin-login') ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
