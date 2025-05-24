import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Replicating bT structure for navigation links
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/destinations', label: 'Destinazioni' },
  { path: '/about', label: 'Chi Siamo' },
];

import React, { useState } from 'react'; // Added useState for mobile menu
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Replicating bT structure for navigation links
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/destinations', label: 'Destinazioni' },
  { path: '/about', label: 'Chi Siamo' },
];

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // AuthContext's logout now handles navigation to /login
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive 
      ? 'text-primary font-semibold border-b-2 border-primary' 
      : 'text-neutral hover:text-primary transition-colors duration-200';
  
  const getMobileNavLinkClass = ({ isActive }) =>
    isActive 
      ? 'block px-3 py-2 rounded-md text-base font-medium bg-primary text-white'
      : 'block px-3 py-2 rounded-md text-base font-medium text-neutral hover:bg-base-200 hover:text-primary';


  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-primary hover:text-secondary transition-colors duration-300">
              Agenzia Viaggi
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Links & Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={(e) => e.currentTarget.focus()}>
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span>{currentUser.name ? currentUser.name.substring(0, 1).toUpperCase() : 'U'}</span>
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li className="px-4 py-2 font-semibold text-neutral border-b mb-1">{currentUser.name}</li>
                  <li>
                    <NavLink to="/profile" className={({isActive}) => isActive ? "text-primary bg-base-200" : "text-neutral"}>
                      Il Mio Profilo
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-ghost text-error w-full text-left justify-start hover:bg-error hover:text-white">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-sm btn-outline btn-primary hover:bg-primary hover:text-white">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-sm btn-primary hover:bg-secondary">
                  Registrati
                </NavLink>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="btn btn-square btn-ghost"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> // Close icon
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-base-300">
            {currentUser ? (
              <div className="px-5">
                <div className="font-medium text-base-content mb-1">{currentUser.name}</div>
                <div className="text-sm text-neutral-focus mb-2">{currentUser.email}</div>
                <NavLink 
                  to="/profile" 
                  className={getMobileNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Il Mio Profilo
                </NavLink>
                <button 
                  onClick={handleLogout} 
                  className="mt-1 block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-error hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <NavLink 
                  to="/login" 
                  className={getMobileNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className={getMobileNavLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrati
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
