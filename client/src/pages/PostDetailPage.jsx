import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const visitorId = useMemo(() => {
    const storedId = localStorage.getItem('visitorId');
    if (storedId) return storedId;
    const newId = Math.random().toString(36).substring(2);
    localStorage.setItem('visitorId', newId);
    return newId;
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
      setLikeCount(data.likes);
      setLiked(data.likedBy?.includes(visitorId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, visitorId]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    window.scrollTo(0, 0);
  }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${id}/like`, { visitorId });
      setLikeCount(data.likes);
      setLiked(data.liked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!username.trim() || !comment.trim()) return;
    try {
      setSubmitting(true);
      const { data } = await API.post(`/comments/${id}`, { username, comment });
      setComments([data, ...comments]);
      setComment('');
      setUsername('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-brand-100 rounded-full w-24" />
          <div className="space-y-4">
            <div className="h-12 bg-brand-100 rounded-2xl w-3/4" />
            <div className="h-6 bg-brand-100 rounded-full w-1/2" />
          </div>
          <div className="h-[400px] bg-brand-100 rounded-[3rem]" />
          <div className="space-y-4">
            <div className="h-4 bg-brand-100 rounded-full" />
            <div className="h-4 bg-brand-100 rounded-full" />
            <div className="h-4 bg-brand-100 rounded-full w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <span className="text-6xl mb-6">🛰️</span>
        <h2 className="text-3xl font-display font-bold text-brand-900 mb-4 tracking-tight">Post Not Found</h2>
        <p className="text-brand-500 mb-8 max-w-md">The article you're looking for might have been moved or deleted.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Return to Hub
        </button>
      </div>
    );
  }

  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `http://localhost:5001${post.image}`)
    : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="pb-32">
      {/* Article Header */}
      <header className="pt-12 pb-16 sm:pt-20 sm:pb-24 bg-white border-b border-brand-50">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-brand-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-10"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to newsroom
          </button>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="bg-brand-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              {post.category}
            </span>
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
              {post.brand}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-200"></span>
            <span className="text-brand-400 font-bold text-[10px] uppercase tracking-widest">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-brand-900 mb-10 leading-[1.1] tracking-tighter">
            {post.title}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-xl shadow-inner">
                👤
              </div>
              <div>
                <p className="text-brand-900 font-bold text-sm uppercase tracking-wider">{post.author}</p>
                <p className="text-brand-400 text-xs font-medium uppercase tracking-widest">Editorial Team</p>
              </div>
            </div>
            <div className="h-8 w-px bg-brand-100 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-6 text-brand-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="text-lg">👁️</span> {post.views} views
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">❤️</span> {likeCount} likes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 sm:-mt-16 mb-16 sm:mb-24">
        <div className="aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-900/20 ring-8 ring-white">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Article Content */}
        <article className="prose prose-lg prose-brand max-w-none mb-20">
          <div className="text-brand-800 leading-[1.8] text-lg sm:text-xl font-medium whitespace-pre-line first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
            {post.content}
          </div>
        </article>

        {/* Action Bar */}
        <div className="flex items-center justify-between py-10 border-t border-brand-100 mb-20">
          <button
            onClick={handleLike}
            className={`group flex items-center gap-4 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-500 shadow-lg ${
              liked
                ? 'bg-primary text-white shadow-primary/30 scale-105'
                : 'bg-white text-brand-900 border border-brand-100 hover:border-primary hover:shadow-primary/10'
            }`}
          >
            <span className={`text-xl transition-transform duration-500 ${liked ? 'scale-125' : 'group-hover:scale-110'}`}>
              {liked ? '❤️' : '🤍'}
            </span>
            {liked ? 'Added to Likes' : 'Like Article'}
            <span className="ml-2 px-2 py-0.5 rounded-lg bg-black/10 text-[10px]">{likeCount}</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300 hidden sm:block">Share Article</span>
            <div className="flex gap-2">
              {['𝕏', 'f', 'in'].map(social => (
                <button key={social} className="w-10 h-10 rounded-full border border-brand-100 flex items-center justify-center text-brand-400 hover:border-primary hover:text-primary transition-all">
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="bg-brand-50 rounded-[3rem] p-8 sm:p-12 lg:p-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-brand-900 text-3xl font-display font-bold uppercase tracking-tighter">
              Conversations <span className="text-primary italic">({comments.length})</span>
            </h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="bg-white rounded-[2rem] p-8 shadow-sm border border-brand-100 mb-16 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <p className="text-brand-900 font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="text-xl">✍️</span> Share your thoughts
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your display name"
                  className="w-full bg-brand-50 text-brand-900 text-sm font-bold uppercase tracking-widest px-6 py-4 rounded-2xl outline-none border border-transparent focus:border-brand-200 focus:bg-white transition-all"
                />
              </div>
              
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What's on your mind regarding this release?"
                  rows={4}
                  className="w-full bg-brand-50 text-brand-900 text-base font-medium px-6 py-5 rounded-3xl outline-none border border-transparent focus:border-brand-200 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-10 py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  {submitting ? 'Sending...' : 'Post Thought'}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-2">
                No discussion yet
              </p>
              <p className="text-brand-300 text-xs">Be the first to join the conversation.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c._id} className="bg-white rounded-3xl p-8 border border-brand-100 hover:border-brand-200 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-lg font-bold text-brand-900 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        {c.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-brand-900 font-bold text-sm uppercase tracking-wider">{c.username}</p>
                        <p className="text-brand-300 text-[10px] font-bold uppercase tracking-widest">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-brand-700 text-base leading-relaxed font-medium pl-14">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;
