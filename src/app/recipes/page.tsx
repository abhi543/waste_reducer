"use client";

import { useState } from "react";
import { useAppContext } from "@/store/AppContext";
import { ChefHat, Clock, Sparkles } from "lucide-react";

export default function RecipesView() {
  const { inventory } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);

  // Get Top 3 Expiring Items
  const expiringItems = [...inventory]
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 3);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI delay
    setTimeout(() => {
      setIsGenerating(false);
      // Hardcoded Phase 1 logic based on PRD
      setRecipes([
        {
          id: "r1",
          name: "Lemon Garlic Kale & Chicken Pasta",
          difficulty: "Easy",
          time: "25 min",
          missing: ["Pasta", "Lemon"],
        },
        {
          id: "r2",
          name: "Crispy Roasted Vegetables with Tahini",
          difficulty: "Medium",
          time: "40 min",
          missing: ["Tahini", "Olive Oil"],
        },
        {
          id: "r3",
          name: "Kitchen Sink Frittata",
          difficulty: "Easy",
          time: "20 min",
          missing: ["Eggs"],
        }
      ]);
    }, 1500);
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <header className="pt-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-dark to-brand bg-clip-text text-transparent flex items-center gap-2">
          <ChefHat className="text-brand-dark" />
          Recipe Magic
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Turn expiring food into delicious meals
        </p>
      </header>

      {expiringItems.length > 0 ? (
        <section className="glass rounded-2xl p-4 border border-brand-light">
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand" />
            Focusing on:
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {expiringItems.map(i => (
              <span key={i.id} className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs font-semibold">
                {i.name}
              </span>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isGenerating ? (
              <span className="animate-spin mr-2">◌</span>
            ) : null}
            {isGenerating ? "Consulting AI chef..." : "What's for Dinner?"}
          </button>
        </section>
      ) : (
        <div className="text-center py-10 px-4 glass rounded-2xl">
          <p className="text-slate-500 font-medium">Add items to get recipe suggestions!</p>
        </div>
      )}

      {recipes.length > 0 && (
        <section className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="font-semibold text-lg">Suggested For You</h2>
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 w-full relative">
                 <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Image Phase 2
                 </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg leading-tight">{recipe.name}</h3>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    <Clock size={12} /> {recipe.time}
                  </span>
                  <span className="font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {recipe.difficulty}
                  </span>
                </div>

                {recipe.missing && recipe.missing.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs font-semibold text-slate-500 mb-2">You still need:</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.missing.map((m: string) => (
                        <span key={m} className="text-[10px] bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-2 py-1 rounded-md mb-1">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button className="mt-4 w-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 py-2 rounded-xl font-medium text-sm active:opacity-80 transition-transform">
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
