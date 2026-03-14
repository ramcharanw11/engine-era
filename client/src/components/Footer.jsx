import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-primary font-bold text-xl mb-3">⚙ Engine Era</h3>
            <p className="text-text-soft text-sm leading-relaxed">
              Your go-to source for the latest automobile news, reviews, and updates from around the world.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-text-main font-semibold mb-3">Categories</h4>
            <ul className="space-y-2">
              {['Electric Cars', 'SUVs', 'Sports Cars', 'Luxury Cars', 'Concept Cars', 'Car Launches'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="text-text-soft hover:text-primary text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-main font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-text-soft hover:text-primary text-sm transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-text-soft hover:text-primary text-sm transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-8 pt-6 text-center text-text-soft text-sm">
          © 2024 Engine Era. Built with MERN Stack.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
