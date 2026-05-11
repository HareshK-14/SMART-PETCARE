import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Plus, Image, Smile, Search, Bookmark } from 'lucide-react';

const DEMO_POSTS = [
  {
    id:1, user:'Priya S.', avatar:'P', pet:'Bruno (Golden Retriever)',
    time:'2 hours ago', likes:24, comments:5, bookmarked:false,
    image: null,
    text:"Bruno just learned to shake hands 🐾 Took only 3 treats! Who says old dogs can't learn new tricks? 😂",
    tags:['Training','GoldenRetriever','DogLife'],
  },
  {
    id:2, user:'Rajan A.', avatar:'R', pet:'Rocky (Husky)',
    time:'5 hours ago', likes:41, comments:12, bookmarked:true,
    image: null,
    text:"Rocky's first snow experience! He absolutely lost his mind 🌨️❄️ Huskies were literally built for this. The zoomies were REAL.",
    tags:['Husky','SnowDay','DogZoomies'],
  },
  {
    id:3, user:'Emily R.', avatar:'E', pet:'Charlie (Golden Retriever)',
    time:'1 day ago', likes:67, comments:18, bookmarked:false,
    image: null,
    text:"Just finished Charlie's annual vet checkup at SmartPetCare clinic. Dr. Sharma gave him a clean bill of health! 🩺✅ Highly recommend booking through the app — super easy!",
    tags:['HealthCheck','VetVisit','PetCare'],
  },
  {
    id:4, user:'Meena K.', avatar:'M', pet:'Luna (Persian Cat)',
    time:'2 days ago', likes:33, comments:9, bookmarked:false,
    image: null,
    text:"Luna has officially taken over my home office chair... again. Working from the floor today. 😅🐱 #CatLogic #WorkFromHome",
    tags:['CatLife','PersianCat','WorkFromHome'],
  },
];

const GRAD = 'linear-gradient(135deg,#6366f1,#14b8a6)';
const AVATAR_COLORS = { P:'#6366f1', R:'#ef4444', E:'#14b8a6', M:'#f59e0b', U:'#8b5cf6' };

export default function CommunityFeedTab() {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [search, setSearch] = useState('');
  const owner = JSON.parse(localStorage.getItem('currentUser') || '{"name":"You"}');

  const toggleLike = (id) => setPosts(p => p.map(x => x.id===id ? {...x, likes: x.likes+(x.liked?-1:1), liked: !x.liked} : x));
  const toggleBookmark = (id) => setPosts(p => p.map(x => x.id===id ? {...x, bookmarked: !x.bookmarked} : x));

  const submitPost = () => {
    if (!newPost.trim()) return;
    setPosting(true);
    setTimeout(() => {
      const post = {
        id: Date.now(), user: owner.name || 'You', avatar: (owner.name||'U')[0].toUpperCase(),
        pet: 'My Pet', time: 'Just now', likes: 0, comments: 0, bookmarked: false, liked: false,
        text: newPost, tags:[],
      };
      setPosts(p => [post, ...p]);
      setNewPost('');
      setPosting(false);
    }, 1000);
  };

  const filtered = posts.filter(p =>
    p.text.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 rounded-2xl p-6 text-white text-center">
        <h2 className="text-2xl font-black">🐾 Pet Community</h2>
        <p className="text-indigo-200 text-sm mt-1">Share your pet moments, tips, and connect with fellow pet parents</p>
        <div className="flex justify-center gap-6 mt-4 text-center">
          {[['1.2K','Members'], ['340','Posts Today'], ['58','Active Now']].map(([v,l]) => (
            <div key={l}>
              <p className="text-xl font-extrabold">{v}</p>
              <p className="text-xs text-indigo-200">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search posts, tags, or users..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 outline-none"/>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{background: GRAD}}>{(owner.name||'U')[0].toUpperCase()}</div>
          <div className="flex-1">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              rows={3} placeholder="Share a pet moment, tip, or story... 🐾"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 outline-none resize-none"/>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition"><Image className="w-4 h-4"/></button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition"><Smile className="w-4 h-4"/></button>
              </div>
              <button onClick={submitPost} disabled={posting || !newPost.trim()}
                className="px-5 py-2 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition"
                style={{background: GRAD}}>
                {posting ? 'Posting...' : '✦ Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {filtered.map((p, i) => (
          <motion.div key={p.id}
            initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
            transition={{delay: i*0.05}}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Post header */}
            <div className="flex items-center gap-3 p-4 pb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{background: AVATAR_COLORS[p.avatar] || GRAD}}>{p.avatar}</div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-900 text-sm">{p.user}</p>
                <p className="text-xs text-slate-400">{p.pet} · {p.time}</p>
              </div>
              <button onClick={() => toggleBookmark(p.id)}
                className={`p-2 rounded-xl transition ${p.bookmarked ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-indigo-400'}`}>
                <Bookmark className="w-4 h-4" fill={p.bookmarked ? 'currentColor' : 'none'}/>
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-slate-800 text-sm leading-relaxed">{p.text}</p>
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 px-3 pb-3 border-t border-slate-50 pt-3">
              <button onClick={() => toggleLike(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition ${p.liked ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Heart className="w-4 h-4" fill={p.liked?'currentColor':'none'}/> {p.likes}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition">
                <MessageCircle className="w-4 h-4"/> {p.comments}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition ml-auto">
                <Share2 className="w-4 h-4"/> Share
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold">No posts found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
