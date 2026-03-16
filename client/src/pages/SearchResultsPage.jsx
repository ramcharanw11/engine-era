import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import API from '../utils/api';

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/posts/search?q=${query}`);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
    window.scrollTo(0, 0);
  }, [fetchResults]);

  return (
    <div className="pb-32">
      {/* Search Header */}
      <header className="bg-brand-900 pt-20 pb-24 sm:pt-24 sm:pb-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[200px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/" className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-6 block hover:text-white transition-colors">
            ← Back to Archive
          </Link>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 tracking-tighter uppercase">
            Search Results for <span className="text-primary italic">"{query}"</span>
          </h1>
          {!loading && (
            <p className="text-brand-300 text-lg font-medium uppercase tracking-widest">
              Found {posts.length} {posts.length === 1 ? 'Entry' : 'Entries'}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-12 sm:-mt-16">
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-brand-900/10 min-h-[50vh]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-brand-50 rounded-[2rem] h-96 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32">
              <span className="text-6xl mb-6 block">🔭</span>
              <h3 className="text-brand-900 text-2xl font-display font-bold mb-2">No Matching Results</h3>
              <p className="text-brand-400 max-w-sm mx-auto">We couldn't find anything matching your search. Try using more general terms or brands.</p>
              <Link to="/" className="btn-primary mt-10 inline-block">
                Back to Newsroom
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
