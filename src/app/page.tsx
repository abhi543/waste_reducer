"use client";

import { useState } from "react";
import { useAppContext } from "@/store/AppContext";
import { Plus, ScanLine, AlertCircle } from "lucide-react";
import ScannerModal from "@/components/ScannerModal";

export default function InventoryView() {
  const { inventory, addInventoryItem, removeInventoryItem } = useAppContext();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemDays, setNewItemDays] = useState("7");

  // Sorting items by expiry
  const sortedInventory = [...inventory].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  const expiringSoon = sortedInventory.filter(
    (item) => (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24) <= 3
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(newItemDays));

    addInventoryItem({
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || undefined,
      category: "Pantry", // simplified MVP
      expiryDate: expiryDate.toISOString(),
    });

    setNewItemName("");
    setNewItemQuantity("");
    setNewItemDays("7");
    setShowAdd(false);
  };

  const getDaysRemaining = (isoDate: string) => {
    const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / (1000 * 3600 * 24));
    return days;
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-dark to-brand bg-clip-text text-transparent">
            My Fridge
          </h1>
          <p className="text-sm text-slate-500">Track and save</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-2.5 rounded-full shadow-sm hover:shadow-md transition-all active:opacity-80 flex items-center justify-center gap-1"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="bg-brand text-white px-4 py-2.5 rounded-full shadow-lg shadow-brand/20 hover:shadow-xl transition-all active:opacity-80 flex items-center gap-2 font-semibold text-sm"
          >
            <ScanLine size={18} />
            Scan
          </button>
        </div>
      </header>

      {/* Manual Add Form */}
      {showAdd && (
        <form onSubmit={handleAddItem} className="glass p-4 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <h2 className="font-semibold mb-3">Add Item Manually</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Milk, Apples..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-brand border border-slate-200 dark:border-slate-700"
            />
            <input
              type="text"
              placeholder="Qty"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="w-16 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-brand border border-slate-200 dark:border-slate-700"
            />
            <select
              value={newItemDays}
              onChange={(e) => setNewItemDays(e.target.value)}
              className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-brand border border-slate-200 dark:border-slate-700"
            >
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
            </select>
            <button
              type="submit"
              className="bg-brand text-white px-4 py-2 rounded-xl font-medium"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Scanner Overlay */}
      {showScanner && (
        <ScannerModal onClose={() => setShowScanner(false)} />
      )}

      {/* Expiring Soon Carousel */}
      {expiringSoon.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-danger animate-pulse" />
            Expiring Soon
          </h2>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-3 snap-x hide-scrollbar">
            {expiringSoon.map((item) => {
              const days = getDaysRemaining(item.expiryDate);
              return (
                <div
                  key={item.id}
                  className="snap-start flex-shrink-0 w-40 glass rounded-2xl p-4 border-t-4 border-status-danger"
                >
                  <div className="flex items-baseline gap-1">
                      <h3 className="font-bold truncate">{item.name}</h3>
                      {item.quantity && <span className="text-sm text-slate-500 font-normal truncate">({item.quantity})</span>}
                  </div>
                  <p className="text-status-danger font-medium text-sm mt-1">
                    {days <= 0 ? "Expired" : `${days} days left`}
                  </p>
                  <button
                    onClick={() => removeInventoryItem(item.id, true)}
                    className="mt-3 w-full bg-slate-100 dark:bg-slate-800 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 active:opacity-80 transition-transform"
                  >
                    Used It!
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Full Pantry */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">All Items ({inventory.length})</h2>
        </div>
        
        {inventory.length === 0 ? (
          <div className="text-center py-10 px-4 glass rounded-2xl border-dashed">
            <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="text-brand" size={32} />
            </div>
            <p className="text-slate-500 font-medium">Your fridge is empty!</p>
            <p className="text-sm text-slate-400 mt-1">Tap + to add manually, or Scan to use camera.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedInventory.map((item) => {
              const days = getDaysRemaining(item.expiryDate);
              let statusColor = "text-status-good";
              let statusBg = "bg-brand-light";
              if (days <= 3) {
                statusColor = "text-status-danger";
                statusBg = "bg-status-danger/10";
              } else if (days <= 7) {
                statusColor = "text-status-warning";
                statusBg = "bg-status-warning/10";
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50"
                >
                  <div>
                    <div className="flex items-baseline gap-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.quantity && <span className="text-sm text-slate-500">({item.quantity})</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBg} ${statusColor}`}>
                      {days <= 0 ? "Expired" : `${days}d`}
                    </span>
                    <button
                      onClick={() => removeInventoryItem(item.id, false)}
                      className="p-1.5 text-slate-400 hover:text-status-danger transition-colors"
                      title="Discard"
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
