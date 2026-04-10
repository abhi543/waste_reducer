"use client";

import { useState } from "react";
import { useAppContext } from "@/store/AppContext";
import { ShoppingCart, Plus, Check, AlertTriangle } from "lucide-react";

export default function ShoppingListView() {
  const { shoppingList, inventory, setShoppingList, moveToInventory } = useAppContext();
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [warning, setWarning] = useState<string | null>(null);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const trimmedName = newItemName.trim().toLowerCase();
    
    // Check for duplicates in Inventory
    const inInventory = inventory.some(item => item.name.toLowerCase() === trimmedName);
    if (inInventory && warning !== trimmedName) {
      setWarning(trimmedName);
      return; 
    }

    setShoppingList(prev => [...prev, {
        id: crypto.randomUUID(),
        name: newItemName.trim(),
        quantity: newItemQuantity.trim() || undefined,
    }]);

    setNewItemName("");
    setNewItemQuantity("");
    setWarning(null);
  };

  const handleForceAdd = () => {
    if (!newItemName.trim()) return;
    setShoppingList(prev => [...prev, {
        id: crypto.randomUUID(),
        name: newItemName.trim(),
        quantity: newItemQuantity.trim() || undefined,
    }]);
    setNewItemName("");
    setNewItemQuantity("");
    setWarning(null);
  };

  const removeItem = (id: string) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <header className="pt-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-dark to-brand bg-clip-text text-transparent flex items-center gap-2">
          <ShoppingCart className="text-brand-dark" />
          Shopping List
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Buy what you need, use what you buy
        </p>
      </header>

      {/* Add to List */}
      <section className="glass rounded-2xl p-4">
        <form onSubmit={handleAddItem} className="flex gap-2">
           <input
              type="text"
              placeholder="Add item..."
              value={newItemName}
              onChange={(e) => {
                  setNewItemName(e.target.value);
                  setWarning(null);
              }}
              className="flex-1 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand border border-slate-200 dark:border-slate-700"
            />
            <input
              type="text"
              placeholder="Qty"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="w-20 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand border border-slate-200 dark:border-slate-700"
            />
            <button
              type="submit"
              className="bg-brand text-white px-4 py-3 rounded-xl hover:bg-brand-dark transition-colors active:opacity-80"
            >
              <Plus size={20} />
            </button>
        </form>
        
        {warning && (
            <div className="mt-3 p-3 bg-status-warning/10 text-status-warning rounded-xl border border-status-warning/20 flex gap-2 items-start text-sm animate-in zoom-in-95">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">You already have this!</p>
                  <p className="text-status-warning/80">Are you sure you want to buy more?</p>
                  <button 
                    onClick={handleForceAdd}
                    className="mt-2 bg-status-warning text-white px-3 py-1 rounded-lg font-medium text-xs shadow-sm"
                  >
                    Add anyway
                  </button>
                </div>
            </div>
        )}
      </section>

      {/* List */}
      <section>
          {shoppingList.length === 0 ? (
             <div className="text-center py-12 px-4">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500 font-medium">You're all caught up!</p>
             </div>
          ) : (
            <div className="space-y-2">
              {shoppingList.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                     <div className="flex items-baseline gap-2">
                         <span className="font-medium text-lg">{item.name}</span>
                         {item.quantity && <span className="text-sm text-slate-500">({item.quantity})</span>}
                     </div>
                     
                     <div className="flex gap-2">
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-status-danger dark:bg-slate-700 transition-colors"
                        >
                            X
                        </button>
                        <button 
                            onClick={() => moveToInventory(item.id, 7)}
                            className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl font-semibold text-sm active:opacity-80 transition-all flex items-center gap-1 shadow-sm shadow-brand/20"
                        >
                            <Check size={16} /> Bought
                        </button>
                     </div>
                  </div>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
