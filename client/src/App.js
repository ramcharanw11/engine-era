import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Pages (we'll build these in Phase 3)
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CategoryPage from './pages/CategoryPage';                         
import SearchResultsPage from './pages/SearchResultsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-page">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
