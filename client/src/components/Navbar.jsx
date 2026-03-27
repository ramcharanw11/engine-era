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
    <nav className="bg-surface/95 backdrop-blur border-b border-border-subtle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-primary font-bold text-2xl tracking-tight">
          ⚙ Engine Era
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-text-main hover:text-primary transition-colors text-sm font-medium">
            Home
          </Link>
          <Link to="/category/Electric Cars" className="text-text-main hover:text-primary transition-colors text-sm font-medium">
            Electric
          </Link>
          <Link to="/category/SUVs" className="text-text-main hover:text-primary transition-colors text-sm font-medium">
            SUVs
          </Link>
          <Link to="/category/Sports Cars" className="text-text-main hover:text-primary transition-colors text-sm font-medium">
            Sports
          </Link>
          <Link to="/category/Luxury Cars" className="text-text-main hover:text-primary transition-colors text-sm font-medium">
            Luxury
          </Link>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars..."
            className="bg-surface-muted text-text-main text-sm px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-primary w-48 border border-border-subtle"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-strong transition-colors"
          >
            Search
          </button>
        </form>

        {/* Admin */}
        <div className="hidden md:flex items-center gap-3">
          {admin ? (
            <>
              <Link
                to="/admin"
                className="text-sm text-text-main hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm bg-surface-muted px-3 py-1.5 rounded-full text-text-main hover:text-primary transition-colors border border-border-subtle"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-primary px-4 py-2 rounded-full text-white hover:bg-primary-strong transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-text-main"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border-subtle px-4 py-4 flex flex-col gap-4">
          <Link to="/" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/category/Electric Cars" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Electric</Link>
          <Link to="/category/SUVs" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>SUVs</Link>
          <Link to="/category/Sports Cars" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Sports</Link>
          <Link to="/category/Luxury Cars" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Luxury</Link>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cars..."
              className="bg-surface-muted text-text-main text-sm px-4 py-2 rounded-full outline-none flex-1 border border-border-subtle"
            />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary-strong transition-colors">
              Go
            </button>
          </form>
          {admin ? (
            <>
              <Link to="/admin" className="text-text-main hover:text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-text-main hover:text-primary text-sm font-medium">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-primary text-sm font-medium" onClick={() => setMenuOpen(false)}>Admin Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
