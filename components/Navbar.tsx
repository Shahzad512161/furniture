
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ShoppingCart, User, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-amber-700 dark:text-amber-500">
              OAK & IRON
            </Link>
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path) 
                      ? 'text-amber-700 dark:text-amber-500' 
                      : 'text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Link to="/cart" className="relative p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              {currentUser ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  <Link to="/profile" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                    <User size={20} />
                  </Link>
                </>
              ) : (
                <Link to="/login" className="text-sm font-medium text-amber-700 dark:text-amber-500 hover:underline">
                  Login
                </Link>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
