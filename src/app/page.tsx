'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Rocket, 
  ArrowRight,
  Code,
  Globe,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { StatCard } from '@/components/StatCard';
import { TradeFeed } from '@/components/TradeFeed';
import { AlphaFeed } from '@/components/AlphaFeed';
import { PulseChart } from '@/components/PulseChart';
import { LaunchpadModal } from '@/components/LaunchpadModal';
import { BagsProject, Trade } from '@/lib/bags-api';

export default function Home() {
  const { connected: walletConnected, publicKey: walletPublicKey } = useWallet();
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  const connected = walletConnected || isGuestMode;
  const publicKey = walletPublicKey || (isGuestMode ? new PublicKey('11111111111111111111111111111111') : null);
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [project, setProject] = useState<BagsProject | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<BagsProject[]>([]);
  const [chartData, setChartData] = useState<{date: string, value: number}[]>([]);
  const [timeframe, setTimeframe] = useState<'D' | 'W' | 'M'>('D');
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProjectSelect = (selectedProject: BagsProject) => {
    showToast(`Loading analytics for ${selectedProject.name}...`);
    // Simulate API load
    setTimeout(() => {
      setProject(selectedProject);
    }, 500);
  };

  const handleViewAllTrending = () => {
    showToast("Loading extended ecosystem leaderboard...");
    setTimeout(() => {
      const moreProjects: BagsProject[] = Array.from({ length: 15 }).map((_, i) => ({
        id: `t-new-${i}-${Date.now()}`,
        name: `Ecosystem Alpha ${i+6}`,
        symbol: `EA${i+6}`,
        creator: `0x${i}`,
        marketCap: 800000 - (i * 40000),
        volume24h: 100000 - (i * 5000),
        totalFees: 1000 - (i * 50),
        stars: Math.floor(Math.random() * 100),
        launchTimestamp: Date.now()
      }));
      setTrendingProjects((prev) => [...prev, ...moreProjects]);
    }, 800);
  };

  const handleViewLess = () => {
    setTrendingProjects((prev) => prev.slice(0, 5));
  };

  const handleLaunchSuccess = (name: string, symbol: string) => {
    showToast(`Successfully launched ${name}! Dashboard updating...`);
    const newProject: BagsProject = {
      id: `new-${Date.now()}`,
      name,
      symbol,
      creator: publicKey?.toBase58() || 'Unknown',
      marketCap: 100000,
      volume24h: 0,
      totalFees: 0,
      stars: 0,
      launchTimestamp: Date.now()
    };
    setProject(newProject);
  };

  // Mock data for demonstration
  useEffect(() => {
    setMounted(true);
    if (connected && publicKey) {
      setTimeout(() => {
        setProject({
          id: '1',
          name: 'Superteam Bags',
          symbol: 'TEAM',
          creator: publicKey?.toString() || '',
          marketCap: 1250000,
          volume24h: 45000,
          totalFees: 1250,
          stars: 42,
          launchTimestamp: Date.now() - 86400000 * 7
        });

        const mockTrades: Trade[] = Array.from({ length: 10 }).map((_, i) => ({
          id: i.toString(),
          projectId: '1',
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          amount: Math.floor(Math.random() * 1000) + 100,
          price: 0.042 + (Math.random() * 0.01),
          timestamp: Date.now() - (i * 300000),
          trader: 'D66...Xp2z'
        }));
        setTrades(mockTrades);

        // Generate mock trending projects
        const mockTrending: BagsProject[] = [
          { id: 't1', name: 'Neural Pepe', symbol: 'NPEPE', creator: '0x1', marketCap: 5000000, volume24h: 1200000, totalFees: 12000, stars: 150, launchTimestamp: Date.now() },
          { id: 't2', name: 'Solana Yield', symbol: 'SYIELD', creator: '0x2', marketCap: 3500000, volume24h: 850000, totalFees: 8500, stars: 80, launchTimestamp: Date.now() },
          { id: 't3', name: 'DeFi Pulse', symbol: 'DPULSE', creator: '0x3', marketCap: 2100000, volume24h: 450000, totalFees: 4500, stars: 45, launchTimestamp: Date.now() },
          { id: 't4', name: 'GameFi Hub', symbol: 'GFH', creator: '0x4', marketCap: 1500000, volume24h: 300000, totalFees: 3000, stars: 120, launchTimestamp: Date.now() },
          { id: 't5', name: 'Meme AI', symbol: 'MAI', creator: '0x5', marketCap: 900000, volume24h: 150000, totalFees: 1500, stars: 25, launchTimestamp: Date.now() },
        ];
        setTrendingProjects(mockTrending);

        setLoading(false);
      }, 1500);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (!project) return;
    
    // Generate mock chart data based on timeframe and current project
    let points = 20;
    let step = project.marketCap * 0.02 || 5000;
    let multiplier = 86400000; // Day
    
    if (timeframe === 'W') { 
      points = 12; 
      step = project.marketCap * 0.1 || 20000; 
      multiplier = 604800000; // Week
    } else if (timeframe === 'M') { 
      points = 6; 
      step = project.marketCap * 0.3 || 50000; 
      multiplier = 2592000000; // Month
    }

    const baseValue = project.marketCap * 0.6 || 50000;

    const mockData = Array.from({ length: points }).map((_, i) => ({
      date: new Date(Date.now() - (points - 1 - i) * multiplier).toLocaleDateString(),
      value: baseValue + (i * step) + (Math.random() * (step * 2) - step)
    }));
    setChartData(mockData);
  }, [timeframe, project]);

  if (!connected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl"
        >
          <div className="badge mb-4 animate-pulse">HACKATHON BUILD v1.0</div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter leading-none">
            Track Your Bags <br/> 
            <span className="accent-gradient">Real Traction.</span>
          </h1>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            The ultimate command center for Bags.fm creators. Monitor Market Cap, Volume, and 1% Royalties in real-time, and instantly deploy fee-sharing projects to grow your ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {mounted ? (
              <WalletMultiButton className="btn-primary !h-auto !py-4 !px-8 !rounded-xl !text-black !font-bold border-none" />
            ) : (
              <div className="w-[200px] h-[56px] bg-white/5 rounded-xl animate-pulse" />
            )}
            <button 
              onClick={() => setIsGuestMode(true)}
              className="glass-panel px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 hover:text-accent-primary transition-colors text-white"
            >
              Explore as Guest
            </button>
            <button className="glass-panel px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white/5">
              <Code className="w-5 h-5" />
              View on GitHub
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
              <Zap className="text-black w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter">BAGS PULSE</span>
          </div>
          {mounted ? (
            <WalletMultiButton className="!bg-transparent !border !border-white/10 !rounded-xl !h-10 transition-colors" />
          ) : (
            <div className="w-[140px] h-10 bg-white/5 rounded-xl animate-pulse" />
          )}
        </div>
      </header>

      {/* Hero Stats */}
      <section className="dashboard-grid mt-8">
        <div className="col-span-12 flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold">{project?.name || 'Loading Project...'}</h2>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                <BadgeCheck className="w-3 h-3" /> Onchain Verified
              </div>
            </div>
            <p className="text-muted font-mono text-sm">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</p>
          </div>
          <div className="flex gap-3">
            <button className="glass-panel p-2 rounded-lg"><Globe className="w-5 h-5" /></button>
            <button className="glass-panel p-2 rounded-lg"><Code className="w-5 h-5" /></button>
          </div>
        </div>

        <StatCard 
          title="Market Cap" 
          value={`$${project?.marketCap.toLocaleString() || '0'}`} 
          change="+12.4% (24h)" 
          trend="up" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Total Royalties" 
          value={`$${project?.totalFees.toLocaleString() || '0'}`} 
          change="1.0% Fixed Fee" 
          trend="neutral" 
          icon={ShieldCheck} 
        />
        <StatCard 
          title="24h Volume" 
          value={`$${project?.volume24h.toLocaleString() || '0'}`} 
          change="-5.2% (24h)" 
          trend="down" 
          icon={BarChart3} 
        />
        <StatCard 
          title="GitHub Stars" 
          value={project?.stars || 0} 
          change="Required for Grant" 
          trend="up" 
          icon={Rocket} 
        />

        {/* Main Section */}
        <div className="col-span-8 glass-panel p-8 flex flex-col gap-8 min-h-[400px]">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold">Growth Visualization</h3>
              <p className="text-muted">Tracking your traction across the ecosystem.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTimeframe('D')} className={`badge cursor-pointer transition-colors ${timeframe === 'D' ? '' : 'opacity-50 hover:opacity-100'}`}>D</button>
              <button onClick={() => setTimeframe('W')} className={`badge cursor-pointer transition-colors ${timeframe === 'W' ? '' : 'opacity-50 hover:opacity-100'}`}>W</button>
              <button onClick={() => setTimeframe('M')} className={`badge cursor-pointer transition-colors ${timeframe === 'M' ? '' : 'opacity-50 hover:opacity-100'}`}>M</button>
            </div>
          </div>
          <div className="flex-1 mt-6 relative" style={{ height: '250px' }}>
            {chartData.length > 0 ? (
              <PulseChart data={chartData} color="var(--accent-primary)" height={250} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-2xl border-dashed border border-white/10">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                  <p className="text-muted font-medium">Loading Chart Data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <TradeFeed trades={trades} />

        {/* Third Row: Alpha Feed and additional info */}
        <AlphaFeed 
          trendingProjects={trendingProjects} 
          onProjectClick={handleProjectSelect}
          onViewAll={handleViewAllTrending}
          onViewLess={handleViewLess}
        />
        
        <div className="col-span-8 glass-panel p-8 relative overflow-hidden">
           <div className="absolute top-6 right-6 flex items-center gap-2">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-primary"></span>
             </span>
             <span className="text-xs font-mono text-accent-primary font-bold tracking-widest">LIVE SYNC</span>
           </div>
           
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center border border-accent-secondary/20">
               <Zap className="w-5 h-5 text-accent-secondary" />
             </div>
             <div>
               <h3 className="text-xl font-bold">Bags Protocol Status</h3>
               <p className="text-sm text-muted">Comprehensive Ecosystem Health Diagnostics</p>
             </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">RPC Endpoint</p>
                <p className="font-bold text-sm truncate">mainnet.helius-rpc</p>
              </div>
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Latency</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  <p className="font-bold text-sm">12ms (Optimal)</p>
                </div>
              </div>
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Node Sync</p>
                <p className="font-bold text-sm text-accent-primary">100.00%</p>
              </div>
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Current Block</p>
                <p className="font-bold text-sm font-mono text-white/90">245,192,841</p>
              </div>
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Rate Limit</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2.5">
                  <div className="bg-accent-secondary h-1.5 rounded-full w-[98%] shadow-[0_0_8px_rgba(255,51,102,0.6)]"></div>
                </div>
              </div>
              <div className="glass-panel !border-white/5 bg-black/40 p-4 rounded-xl">
                <p className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Index Status</p>
                <p className="font-bold text-sm">Indexed & Verified</p>
              </div>
           </div>
        </div>

        {/* Launchpad Quick Action */}
        <div className="col-span-12 glass-panel p-8 flex items-center justify-between bg-accent-primary/5 border-accent-primary/20 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Rocket className="w-32 h-32 text-accent-primary" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3 h-3" /> Smart Contract
            </div>
            <h2 className="text-3xl font-black mb-4">Deploy a Fee-Sharing Token</h2>
            <p className="text-muted text-lg">Launch a new Bags sub-project and instantly configure how your 1% protocol royalties are distributed. Secured onchain.</p>
          </div>
          <button 
            className="btn-primary relative z-50 group-hover:pr-10"
            onClick={(e) => {
              e.preventDefault();
              setIsLaunchpadOpen(true);
            }}
          >
            Open Pulse Launchpad
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
          
          {/* Animated background element */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-primary/10 blur-[100px] rounded-full group-hover:bg-accent-primary/20 transition-colors pointer-events-none" />
        </div>
      </section>

      <LaunchpadModal 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onToast={showToast}
        onLaunchSuccess={handleLaunchSuccess}
        isGuest={isGuestMode}
      />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[999] glass-panel px-6 py-3 font-medium bg-black/80 border-accent-primary/30 text-white shadow-[0_0_20px_rgba(0,255,163,0.2)] whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
