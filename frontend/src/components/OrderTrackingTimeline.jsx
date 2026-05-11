import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Star, Clock } from 'lucide-react';

const STEPS = [
  { label: 'Order Placed',    icon: CheckCircle, color: '#6366f1' },
  { label: 'Processing',      icon: Clock,       color: '#f59e0b' },
  { label: 'Shipped',         icon: Truck,       color: '#14b8a6' },
  { label: 'Out for Delivery',icon: Package,     color: '#8b5cf6' },
  { label: 'Delivered',       icon: Star,        color: '#10b981' },
];

const STATUS_STEP = {
  PLACED: 0, PROCESSING: 1, SHIPPED: 2, OUT_FOR_DELIVERY: 3, DELIVERED: 4,
};

const OrderTrackingTimeline = ({ status = 'SHIPPED', trackingId, date }) => {
  const currentStep = STATUS_STEP[status] ?? STATUS_STEP.PLACED;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-extrabold text-slate-700">Order Tracking</p>
        {trackingId && trackingId !== 'Pending' && (
          <p className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">#{trackingId}</p>
        )}
      </div>
      <div className="relative flex items-center justify-between">
        {/* connector line */}
        <div className="absolute h-1 bg-slate-200 top-5 left-5 right-5 rounded-full z-0"/>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute h-1 top-5 left-5 rounded-full z-0"
          style={{ background: 'linear-gradient(90deg,#6366f1,#14b8a6)' }}
        />

        {STEPS.map((step, i) => {
          const done = i <= currentStep;
          const Icon = step.icon;
          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-1.5" style={{ minWidth: 0 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.18, type: 'spring' }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 transition-all ${done ? 'border-transparent text-white' : 'border-slate-200 bg-white'}`}
                style={done ? { background: step.color } : {}}
              >
                <Icon className="w-4 h-4" style={{ color: done ? 'white' : '#94a3b8' }}/>
              </motion.div>
              <p className={`text-[10px] font-bold text-center leading-tight max-w-[60px] ${done ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      {date && <p className="text-xs text-slate-400 mt-3 text-center">Expected delivery: <strong>{date}</strong></p>}
    </div>
  );
};

export default OrderTrackingTimeline;
