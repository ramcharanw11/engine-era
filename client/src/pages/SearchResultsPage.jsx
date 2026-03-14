import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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
  }, [fetchResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-text-main text-3xl font-bold">
          Search Results for{' '}
          <span className="text-primary">"{query}"</span>
        </h1>
        {!loading && (
          <p className="text-text-soft mt-2 text-sm">
            {posts.length} {posts.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl h-72 animate-pulse border border-border-subtle" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-text-soft py-20">
          <p className="text-xl">No results found</p>
          <p className="text-sm mt-2">Try searching for a different keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
