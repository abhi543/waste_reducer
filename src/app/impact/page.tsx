"use client";

import { useAppContext } from "@/store/AppContext";
import { Leaf, DollarSign, TrendingUp, Trophy } from "lucide-react";

export default function ImpactView() {
  const { impact } = useAppContext();

  // Basic leveling logic for gamification
  const totalPoints = Math.floor(impact.moneySaved * 10 + impact.co2Saved * 50);
  const currentLevel = Math.floor(totalPoints / 500) + 1;
  const nextLevelPoints = currentLevel * 500;
  const progressPercent = Math.min(((totalPoints % 500) / 500) * 100, 100);

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <header className="pt-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-dark to-brand bg-clip-text text-transparent flex items-center gap-2">
          <Leaf className="text-brand" />
          Your Impact
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Every meal saved makes a difference.
        </p>
      </header>

      {/* Gamification Banner */}
      <section className="bg-gradient-to-br from-brand-dark to-brand-light p-6 rounded-3xl text-white shadow-lg overflow-hidden relative">
        <div className="absolute -top-10 -right-10 opacity-20 transform rotate-12">
           <Trophy size={150} />
        </div>
        <div className="relative z-10">
            <h2 className="text-brand-dark font-bold text-sm tracking-widest uppercase mb-1">Current Status</h2>
            <div className="flex items-end gap-2 text-brand-dark">
                <span className="text-5xl font-black">{currentLevel}</span>
                <span className="text-lg font-bold pb-1">Level</span>
            </div>
            
            <div className="mt-6 bg-white/30 h-2 w-full rounded-full overflow-hidden">
                <div 
                  className="bg-brand-dark h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }} 
                />
            </div>
            <p className="text-brand-dark text-xs font-semibold mt-2 text-right">
                {totalPoints} / {nextLevelPoints} pts
            </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
          <div className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 border border-brand-light text-brand-dark">
             <div className="bg-brand-light p-3 rounded-full mb-1">
                 <DollarSign size={28} />
             </div>
             <p className="font-semibold text-xs text-slate-500">Money Saved</p>
             <p className="text-3xl font-black">${impact.moneySaved.toFixed(2)}</p>
          </div>
          
          <div className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 border border-blue-100 text-blue-800">
             <div className="bg-blue-100 p-3 rounded-full mb-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
             </div>
             <p className="font-semibold text-xs text-slate-500 text-blue-600">CO₂ Reduced</p>
             <p className="text-3xl font-black">{impact.co2Saved.toFixed(1)} <span className="text-lg">kg</span></p>
          </div>
      </section>

      {/* Info Notice */}
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex gap-3 text-sm text-slate-600 dark:text-slate-400">
          <TrendingUp className="shrink-0 text-brand mt-0.5" />
          <p>Clicking "Used It!" on expiring items automatically increases your impact scores based on average meal waste values.</p>
      </div>

    </main>
  );
}
