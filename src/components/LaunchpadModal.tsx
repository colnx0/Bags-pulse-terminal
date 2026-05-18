'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Settings2, ShieldCheck, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

interface LaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onLaunchSuccess?: (name: string, symbol: string) => void;
  isGuest?: boolean;
}

export const LaunchpadModal: React.FC<LaunchpadModalProps> = ({ isOpen, onClose, onToast, onLaunchSuccess, isGuest }) => {
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectTicker, setProjectTicker] = useState('');
  const { publicKey, signMessage } = useWallet();

  const handleDeploy = async () => {
    if (!isGuest && (!publicKey || !signMessage)) {
      onToast("Please connect your wallet first to sign the launch transaction.");
      return;
    }

    try {
      setIsDeploying(true);
      
      if (!isGuest && publicKey && signMessage) {
        // Message to sign for "authorization"
        const message = new TextEncoder().encode(`Authorize Bags Pulse Launchpad Deployment\nTimestamp: ${Date.now()}`);
        
        // Request signature from the user's wallet
        const signature = await signMessage(message);
        
        console.log('Deployment authorized with signature:', bs58.encode(signature));
      } else {
        // Simulate signature delay for guest mode
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      
      // Simulate the backend API call after authorization
      setTimeout(() => {
        setIsDeploying(false);
        setDeploySuccess(true);
        
        if (onLaunchSuccess) {
          onLaunchSuccess(projectName || 'New Project', projectTicker || 'NEW');
        }
        
        setTimeout(() => {
          setDeploySuccess(false);
          onClose();
          setTimeout(() => setStep(1), 500);
        }, 2000);
      }, 1500);

    } catch (error) {
      console.error("Deployment cancelled or failed:", error);
      setIsDeploying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.4)]">
                    <Rocket className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Pulse Launchpad</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {step === 1 ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Project Details</h3>
                      <p className="text-sm text-muted mb-4">Define your Bags sub-project identity.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Token Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Pulse Pro Token"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Ticker Symbol</label>
                          <input 
                            type="text" 
                            placeholder="e.g. PULSE"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors uppercase"
                            value={projectTicker}
                            onChange={(e) => setProjectTicker(e.target.value.toUpperCase())}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (!projectName.trim() || !projectTicker.trim()) {
                          onToast("Please fill out both the Token Name and Ticker Symbol.");
                          return;
                        }
                        setStep(2);
                      }}
                      className="btn-primary w-full justify-center mt-2"
                      disabled={!projectName.trim() || !projectTicker.trim()}
                      style={{ 
                        opacity: (!projectName.trim() || !projectTicker.trim()) ? 0.5 : 1, 
                        cursor: (!projectName.trim() || !projectTicker.trim()) ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      Next: Fee Sharing <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                     <div>
                      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-accent-secondary" />
                        Advanced Fee Configuration
                      </h3>
                      <p className="text-sm text-muted mb-6">Set up your 1% Bags royalty distribution.</p>
                      
                      <div className="space-y-4">
                        <div className="glass-panel !border-white/5 bg-white/5 p-4 flex justify-between items-center">
                          <div>
                            <span className="block text-sm font-medium">Creator Wallet (You)</span>
                            <span className="block text-xs text-muted font-mono">Current Wallet Connected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-accent-primary">80%</span>
                          </div>
                        </div>

                        <div className="glass-panel !border-white/5 bg-white/5 p-4 flex justify-between items-center">
                          <div>
                            <span className="block text-sm font-medium">Treasury / Dev Fund</span>
                            <span className="block text-xs text-muted font-mono">trsy...8f2a</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-accent-secondary">20%</span>
                          </div>
                        </div>
                        
                        <button className="text-sm text-muted hover:text-white transition-colors w-full text-left py-2 flex items-center gap-2">
                          + Add Recipient
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium flex-1"
                        disabled={isDeploying}
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleDeploy}
                        className={`btn-primary flex-[2] justify-center ${deploySuccess ? 'bg-green-500' : ''}`}
                        disabled={isDeploying || deploySuccess}
                      >
                        {isDeploying ? (
                          <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4 animate-pulse" /> Authorizing...
                          </span>
                        ) : deploySuccess ? (
                          <span className="flex items-center gap-2 text-black">
                            <CheckCircle2 className="w-4 h-4" /> Launched!
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Launch Project
                          </span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
