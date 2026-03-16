import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const CATEGORIES = [
  'Electric Cars',
  'SUVs',
  'Sports Cars',
  'Luxury Cars',
  'Concept Cars',
  'Car Launches',
];

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 9 });
      if (activeCategory) params.append('category', activeCategory);
      const { data } = await API.get(`/posts?${params}`);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page]);

  const fetchFeatured = useCallback(async () => {
    try {
      const { data } = await API.get('/posts/featured');
      setFeatured(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await API.get('/posts/trending');
      setTrending(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchFeatured();
    fetchTrending();
  }, [fetchFeatured, fetchTrending]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[85vh] flex items-center overflow-hidden bg-brand-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-left duration-700">
              New Arrival
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-bold text-white mb-8 leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-left duration-1000 delay-100">
              DRIVING THE <span className="text-primary italic">FUTURE</span> OF LUXURY.
            </h1>
            <p className="text-brand-200 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-left duration-1000 delay-200">
              Explore the most exclusive automotive news, reviews, and insights from across the globe.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left duration-1000 delay-300">
              <button className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest">
                Explore Now
              </button>
              <button className="btn-secondary px-8 py-4 text-sm font-bold uppercase tracking-widest bg-white/10 border-white/20 text-white hover:bg-white hover:text-brand-900">
                Our Fleet
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-24">
        {/* Category Filter */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-brand-900 text-sm font-bold uppercase tracking-widest">
              Browse by <span className="text-primary">Category</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setActiveCategory(''); setPage(1); }}
              className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === ''
                  ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20'
                  : 'bg-white text-brand-500 hover:text-brand-900 border border-brand-100 hover:border-brand-200 shadow-sm'
              }`}
            >
              All Releases
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20'
                    : 'bg-white text-brand-500 hover:text-brand-900 border border-brand-100 hover:border-brand-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Stories */}
        {featured.length > 0 && !activeCategory && (
          <section className="mb-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-brand-900 text-3xl sm:text-4xl font-display font-bold mb-3">
                  Editor's <span className="text-primary italic">Picks</span>
                </h2>
                <div className="h-1 w-12 bg-primary"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {featured.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Latest News Grid */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-brand-900 text-3xl sm:text-4xl font-display font-bold mb-3 uppercase tracking-tighter">
                {activeCategory || 'The Latest'} <span className="text-primary italic">Updates</span>
              </h2>
              <div className="h-1 w-12 bg-primary"></div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-brand-100 rounded-[2rem] h-96 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-brand-100">
              <span className="text-4xl mb-6 block">📂</span>
              <p className="text-brand-900 text-xl font-display font-bold">No entries found in this category</p>
              <p className="text-brand-400 mt-2">Check back soon for new updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center bg-white border border-brand-100 rounded-full text-brand-900 disabled:opacity-30 hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <span className="text-brand-900 font-bold text-sm">{page}</span>
                <span className="text-brand-300 font-medium text-sm">/</span>
                <span className="text-brand-400 font-medium text-sm">{totalPages}</span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-12 h-12 flex items-center justify-center bg-white border border-brand-100 rounded-full text-brand-900 disabled:opacity-30 hover:bg-brand-900 hover:text-white transition-all duration-300 shadow-sm"
              >
                →
              </button>
            </div>
          )}
        </section>

        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="bg-brand-900 rounded-[3rem] p-8 sm:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-tighter">
                  Trending <span className="text-primary italic">Highlights</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trending.map((post, index) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white hover:text-brand-900 transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary font-display font-bold text-3xl opacity-50 group-hover:opacity-100">0{index + 1}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 group-hover:text-brand-500">{post.category}</span>
                    </div>
                    <p className="text-lg font-bold leading-tight line-clamp-2 mb-4">{post.title}</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-brand-400 group-hover:text-brand-500">
                      <span>{post.views} VIEWS</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
