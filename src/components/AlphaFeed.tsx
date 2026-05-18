'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BagsProject } from '@/lib/bags-api';

interface AlphaFeedProps {
  trendingProjects: BagsProject[];
  onProjectClick: (project: BagsProject) => void;
  onViewAll: () => void;
  onViewLess: () => void;
}

export const AlphaFeed: React.FC<AlphaFeedProps> = ({ trendingProjects, onProjectClick, onViewAll, onViewLess }) => {
  return (
    <div className="glass-panel p-6 col-span-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-secondary" />
          Alpha Feed
        </h3>
        <span className="text-xs font-mono text-muted">24H VOLUME</span>
      </div>
      
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {trendingProjects.map((project, index) => {
          // Simulate some dynamic change data for the UI
          const isUp = index % 2 === 0;
          const changePercent = (Math.random() * 15 + 1).toFixed(1);

          return (
            <motion.div
              key={project.id}
              onClick={() => onProjectClick(project)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center font-bold text-xs border border-white/10 group-hover:border-accent-secondary/50 transition-colors">
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm group-hover:text-accent-secondary transition-colors">
                    {project.name}
                  </span>
                  <span className="text-muted text-xs font-mono">
                    ${project.symbol}
                  </span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <span className="font-mono text-sm font-semibold">
                  ${((project.volume24h || 0) / 1000).toFixed(1)}k
                </span>
                <span className={`text-xs flex items-center gap-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {changePercent}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <button 
        onClick={trendingProjects.length > 5 ? onViewLess : onViewAll}
        className="w-full mt-4 py-2 text-sm text-center text-muted hover:text-white transition-colors border border-white/5 rounded-lg hover:bg-white/5"
      >
        {trendingProjects.length > 5 ? 'View Less' : 'View All Trending'}
      </button>
    </div>
  );
};
