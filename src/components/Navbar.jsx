import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Leaf, Activity, Phone, Home,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();

  const isRedTheme =
    location.pathname === '/monitoring' ||
    location.pathname === '/berandairigasi';

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    {
      label: 'monitoring',
      icon: Activity,
      children: [
        { path: '/irigasitetes', label: 'Irigasi Tetes' },
        { path: '/hidroponik', label: 'Hidroponik' },
      ],
    },
    { path: '/contact', label: 'Kontak', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-effect border-b ${isRedTheme ? 'border-red-200/20 bg-red-50/70' : 'border-green-200/20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`p-2 rounded-lg ${isRedTheme ? 'bg-red-500' : 'bg-green-500'}`}
            >
              <Leaf className="h-6 w-6 text-white" />
            </motion.div>
            <span className={`text-xl font-bold ${isRedTheme ? 'text-red-700' : 'text-green-700'}`}>
              SmartFarming
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(item.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <button
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        dropdownOpen === item.label || item.children.some((c) => isActive(c.path))
                          ? `${isRedTheme ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} shadow-lg`
                          : `${isRedTheme ? 'text-red-700 hover:bg-red-100' : 'text-green-700 hover:bg-green-100'}`
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                      {dropdownOpen === item.label ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {dropdownOpen === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-4 py-2 text-sm hover:${
                                isRedTheme ? 'bg-red-100' : 'bg-green-100'
                              } ${
                                isActive(child.path)
                                  ? `${isRedTheme ? 'bg-red-200' : 'bg-green-200'} font-bold`
                                  : ''
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? `${isRedTheme ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} shadow-lg`
                      : `${isRedTheme ? 'text-red-700 hover:bg-red-100' : 'text-green-700 hover:bg-green-100'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={isRedTheme ? 'text-red-700' : 'text-green-700'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() =>
                          setDropdownOpen(dropdownOpen === item.label ? null : item.label)
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-lg w-full ${
                          isRedTheme
                            ? 'text-red-700 hover:bg-red-100'
                            : 'text-green-700 hover:bg-green-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        {dropdownOpen === item.label ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {dropdownOpen === item.label && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => {
                                setIsOpen(false);
                                setDropdownOpen(null);
                              }}
                              className={`block px-3 py-1 rounded-md text-sm ${
                                isActive(sub.path)
                                  ? `${
                                      isRedTheme
                                        ? 'bg-red-500 text-white'
                                        : 'bg-green-500 text-white'
                                    }`
                                  : `${
                                      isRedTheme
                                        ? 'text-red-700 hover:bg-red-100'
                                        : 'text-green-700 hover:bg-green-100'
                                    }`
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? `${isRedTheme ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} shadow-lg`
                        : `${isRedTheme ? 'text-red-700 hover:bg-red-100' : 'text-green-700 hover:bg-green-100'}`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
