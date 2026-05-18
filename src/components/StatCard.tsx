'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex flex-col gap-4 col-span-3"
    >
      <div className="flex justify-between items-center">
        <span className="text-muted text-sm font-medium">{title}</span>
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent-primary" />
        </div>
      </div>
      
      <div className="flex flex-col">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        {change && (
          <span className={`text-xs mt-1 font-semibold ${
            trend === 'up' ? 'text-accent-primary' : 
            trend === 'down' ? 'text-red-400' : 
            'text-muted'
          }`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
};
