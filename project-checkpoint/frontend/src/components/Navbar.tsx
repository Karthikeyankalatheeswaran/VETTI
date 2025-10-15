import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">🎮 Project Checkpoint</span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/my-games"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/my-games') 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      My Games
                    </Link>
                    <Link
                      to="/stats"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/stats') 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Stats
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  Welcome, <span className="font-medium text-white">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login') 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/register') 
                      ? 'bg-green-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            Home
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                to="/my-games"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/my-games') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                My Games
              </Link>
              <Link
                to="/stats"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/stats') 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                Stats
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;