'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, User } from 'lucide-react';
import { Trade } from '@/lib/bags-api';

interface TradeFeedProps {
  trades: Trade[];
}

export const TradeFeed: React.FC<TradeFeedProps> = ({ trades }) => {
  return (
    <div className="glass-panel p-6 col-span-4">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        Recent Activity
        <span className="badge">LIVE</span>
      </h3>
      
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  trade.type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  {trade.type === 'buy' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm group-hover:text-accent-primary transition-colors">
                    {(trade.trader || '').slice(0, 4)}...{(trade.trader || '').slice(-4)}
                  </span>
                  <span className="text-muted text-xs">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="text-right flex flex-col">
                <span className={`font-bold ${
                  trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.type === 'buy' ? '+' : '-'}{trade.amount || 0} BAGS
                </span>
                <span className="text-xs text-muted">
                  ${(trade.price || 0).toFixed(4)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
