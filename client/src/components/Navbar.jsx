import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-dark border-b border-gray-800 px-6 py-4">
      <Link to="/" className="text-primary font-bold text-xl">⚙ Engine Era</Link>
    </nav>
  );
};

export default Navbar;