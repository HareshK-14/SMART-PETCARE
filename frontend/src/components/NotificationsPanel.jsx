import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, AlertTriangle, Calendar, Package, Stethoscope } from 'lucide-react';

const DEFAULT_NOTIFS = [
  { id:1, type:'alert', title:'Vaccination Due!', body:"Luna's Rabies vaccine is overdue. Book now.", time:'2 hrs ago', read:false },
  { id:2, type:'order', title:'Order Delivered', body:'ORD-2841 has been delivered to your address.', time:'1 day ago', read:false },
  { id:3, type:'appt', title:'Appointment Confirmed', body:'Dr. Priya confirmed Milo\'s appointment for Apr 20.', time:'2 days ago', read:true },
  { id:4, type:'info', title:'New products available', body:'Check out premium cat food now in stock!', time:'3 days ago', read:true },
];

const ICONS = {
  alert: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  order: { icon: Package,       color: '#6366f1', bg: '#eef2ff' },
  appt:  { icon: Stethoscope,   color: '#14b8a6', bg: '#f0fdfa' },
  info:  { icon: Bell,          color: '#f59e0b', bg: '#fffbeb' },
};

const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState(() => JSON.parse(localStorage.getItem('notifications') || 'null') || DEFAULT_NOTIFS);
  const save = (n) => { setNotifs(n); localStorage.setItem('notifications', JSON.stringify(n)); };
  const markAll = () => save(notifs.map(n => ({...n, read:true})));
  const dismiss = (id) => save(notifs.filter(n => n.id !== id));
  const markOne = (id) => save(notifs.map(n => n.id===id ? {...n,read:true} : n));
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500"/> Notifications
            {unread > 0 && <span className="ml-1 w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-extrabold flex items-center justify-center">{unread}</span>}
          </h2>
          <p className="text-slate-500 text-sm">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 text-sm text-indigo-600 font-bold hover:text-indigo-800 transition">
            <CheckCheck className="w-4 h-4"/> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifs.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-3 text-slate-200"/>
              <p className="font-bold">All caught up!</p>
            </div>
          )}
          {notifs.map(n => {
            const cfg = ICONS[n.type] || ICONS.info;
            const Icon = cfg.icon;
            return (
              <motion.div key={n.id} layout initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition cursor-pointer ${n.read ? 'bg-white border-slate-100' : 'bg-indigo-50/40 border-indigo-100'}`}
                onClick={() => markOne(n.id)}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{background:cfg.bg}}>
                  <Icon className="w-5 h-5" style={{color:cfg.color}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-bold text-slate-900 text-sm ${!n.read ? '' : 'opacity-75'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5"/>}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{n.body}</p>
                  <p className="text-slate-400 text-[10px] mt-1.5 font-medium">{n.time}</p>
                </div>
                <button onClick={e=>{e.stopPropagation();dismiss(n.id);}} className="text-slate-300 hover:text-rose-400 transition flex-shrink-0">
                  <X className="w-4 h-4"/>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPanel;
