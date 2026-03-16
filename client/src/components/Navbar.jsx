import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${search.trim()}`);
      setSearch('');
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">🏎️</span>
            <span className="text-brand-900 font-display font-bold text-xl sm:text-2xl tracking-tight uppercase">
              Engine<span className="text-primary italic">Era</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-brand-600 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
              Home
            </Link>
            <Link to="/category/Electric Cars" className="text-brand-600 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
              Electric
            </Link>
            <Link to="/category/SUVs" className="text-brand-600 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
              SUVs
            </Link>
            <Link to="/category/Sports Cars" className="text-brand-600 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
              Sports
            </Link>
            <Link to="/category/Luxury Cars" className="text-brand-600 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-wider">
              Luxury
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-brand-100/50 text-brand-900 text-sm px-5 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white w-40 lg:w-56 border border-transparent focus:border-primary/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 group-focus-within:text-primary transition-colors"
              >
                🔍
              </button>
            </form>

            <div className="h-6 w-px bg-brand-200 mx-2"></div>

            {admin ? (
              <div className="flex items-center gap-4">
                <Link to="/admin" className="btn-secondary text-sm">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-brand-500 hover:text-primary transition-colors text-sm font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg bg-brand-50 text-brand-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-brand-900 hover:text-primary text-lg font-semibold" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/category/Electric Cars" className="text-brand-900 hover:text-primary text-lg font-semibold" onClick={() => setMenuOpen(false)}>Electric</Link>
            <Link to="/category/SUVs" className="text-brand-900 hover:text-primary text-lg font-semibold" onClick={() => setMenuOpen(false)}>SUVs</Link>
            <Link to="/category/Sports Cars" className="text-brand-900 hover:text-primary text-lg font-semibold" onClick={() => setMenuOpen(false)}>Sports</Link>
            <Link to="/category/Luxury Cars" className="text-brand-900 hover:text-primary text-lg font-semibold" onClick={() => setMenuOpen(false)}>Luxury</Link>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cars..."
              className="bg-brand-50 text-brand-900 text-base px-6 py-3 rounded-2xl outline-none w-full border border-brand-100"
            />
          </form>

          {admin ? (
            <div className="flex flex-col gap-4 border-t border-brand-100 pt-6">
              <Link to="/admin" className="btn-secondary text-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-brand-500 font-medium">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Admin Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
