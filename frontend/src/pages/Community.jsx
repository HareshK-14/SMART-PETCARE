import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Plus, X, Send } from 'lucide-react';

const STATIC_POSTS = [
  { id: 1, author: 'Emily Davis', time: '2h ago', title: 'Best tips for introducing a new kitten to an older dog?', likes: 24, comments: [{id:1, user:'Jane D', text:'Take it slow! Keep them separated for a few days.'}], content: "We just adopted a 3-month-old kitten, and my 7-year-old Golden Retriever is very curious but a bit too energetic. Any advice on steady introductions?", category: "Training" },
  { id: 2, author: 'Michael R.', time: '5h ago', title: 'Homemade dog treat recipes!', likes: 156, comments: [], content: "I recently started baking pumpkin and peanut butter treats for Buster. He loves them and his coat looks shinier! Recipe in thread.", category: "Diet" },
];

const Community = () => {
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem('communityPosts') || 'null') || STATIC_POSTS);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState({ title: '', content: '', category: 'General' });
  const [expandedPost, setExpandedPost] = useState(null); // id of post to show comments
  const [commentText, setCommentText] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').name || "Anonymous User";

  const save = (p) => {
    setPosts(p);
    localStorage.setItem('communityPosts', JSON.stringify(p));
  };

  const handlePost = () => {
    if (!newPostContent.title || !newPostContent.content) return;
    const newP = {
      id: Date.now(),
      author: currentUser,
      time: 'Just now',
      title: newPostContent.title,
      content: newPostContent.content,
      category: newPostContent.category,
      likes: 0,
      comments: []
    };
    save([newP, ...posts]);
    setShowNewPost(false);
    setNewPostContent({ title: '', content: '', category: 'General' });
  };

  const toggleLike = (id) => {
    save(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleComment = (postId) => {
    if (!commentText.trim()) return;
    save(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...(p.comments||[]), { id: Date.now(), user: currentUser, text: commentText }] };
      }
      return p;
    }));
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pet <span className="text-indigo-600">Community</span></h1>
            <p className="text-slate-500 mt-2">Connect, share experiences, and learn from other pet parents.</p>
          </div>
          <button onClick={() => setShowNewPost(true)} className="flex items-center gap-2 px-5 py-3 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5" style={{background: 'linear-gradient(135deg,#6366f1,#14b8a6)'}}>
            <Plus className="w-5 h-5" /> New Post
          </button>
        </div>

        {/* Forum Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-extrabold text-lg">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{post.author}</p>
                        <p className="text-xs text-slate-400 font-medium">{post.time}</p>
                      </div>
                    </div>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">{post.content}</p>

                  <div className="flex items-center space-x-6 pt-4 border-t border-slate-50 text-slate-500 font-semibold text-sm">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 hover:text-rose-500 transition group">
                      <Heart className="w-5 h-5 group-hover:fill-rose-500" /> {post.likes}
                    </button>
                    <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:text-indigo-600 transition">
                      <MessageSquare className="w-5 h-5" /> {(post.comments||[]).length}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-teal-600 transition ml-auto">
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-slate-50 space-y-4">
                          {(post.comments||[]).map(c => (
                            <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-xs font-bold text-indigo-900 mb-1">{c.user}</p>
                              <p className="text-sm text-slate-600">{c.text}</p>
                            </div>
                          ))}
                          <div className="flex gap-2 relative mt-4">
                            <input type="text" value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')handleComment(post.id)}} placeholder="Add a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition"/>
                            <button onClick={()=>handleComment(post.id)} disabled={!commentText.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl px-4 flex items-center justify-center transition">
                              <Send className="w-4 h-4"/>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4">Trending Topics</h3>
              <ul className="space-y-3 text-sm text-indigo-600 font-semibold">
                {['#DietaryTips', '#PuppyTraining', '#VetAdvice', '#RescueStories'].map(t => (
                  <li key={t} className="hover:text-indigo-800 cursor-pointer transition">{t}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-teal-500 text-white rounded-2xl shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[20px] rounded-full"></div>
               <h3 className="font-extrabold text-lg mb-2 relative z-10">Looking to Adopt?</h3>
               <p className="text-sm text-indigo-100 mb-5 relative z-10 font-medium">Hundreds of pets are waiting for their forever home locally.</p>
               <button className="w-full bg-white text-indigo-700 py-2.5 rounded-xl font-bold shadow-md hover:bg-slate-50 transition relative z-10">View Adoption List</button>
            </div>
          </div>
        </div>

      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowNewPost(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95}} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-extrabold text-slate-900">Create New Post</h3>
                <button onClick={()=>setShowNewPost(false)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition cursor-pointer"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                  <select value={newPostContent.category} onChange={e=>setNewPostContent({...newPostContent,category:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {['General', 'Training', 'Diet', 'Health', 'Behavior'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Title</label>
                  <input value={newPostContent.title} onChange={e=>setNewPostContent({...newPostContent,title:e.target.value})} placeholder="What's your question/topic?" className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Content</label>
                  <textarea value={newPostContent.content} onChange={e=>setNewPostContent({...newPostContent,content:e.target.value})} rows={5} placeholder="Share the details..." className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"></textarea>
                </div>
                <button onClick={handlePost} disabled={!newPostContent.title||!newPostContent.content} className="w-full py-3 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition hover:-translate-y-0.5" style={{background: 'linear-gradient(135deg,#6366f1,#14b8a6)'}}>Post to Community</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
