"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type InventoryItem = {
  id: string;
  name: string;
  quantity?: string;
  category: string;
  addedAt: string; // ISO string
  expiryDate: string; // ISO string
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
};

export type ImpactStats = {
  moneySaved: number;
  co2Saved: number; // in kg
};

type AppContextType = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  shoppingList: ShoppingItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  impact: ImpactStats;
  setImpact: React.Dispatch<React.SetStateAction<ImpactStats>>;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "addedAt">) => void;
  removeInventoryItem: (id: string, used: boolean) => void;
  moveToInventory: (shoppingItemId: string, expiryDays: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [impact, setImpact] = useState<ImpactStats>({ moneySaved: 0, co2Saved: 0 });

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const storedInv = localStorage.getItem("fridgeflow_inventory");
      if (storedInv) setInventory(JSON.parse(storedInv));
      
      const storedShop = localStorage.getItem("fridgeflow_shopping");
      if (storedShop) setShoppingList(JSON.parse(storedShop));
      
      const storedImpact = localStorage.getItem("fridgeflow_impact");
      if (storedImpact) setImpact(JSON.parse(storedImpact));
    } catch (e) {
      console.error("Local storage decoding error", e);
    }
  }, []);

  // Save to localStorage when things change
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("fridgeflow_inventory", JSON.stringify(inventory));
    localStorage.setItem("fridgeflow_shopping", JSON.stringify(shoppingList));
    localStorage.setItem("fridgeflow_impact", JSON.stringify(impact));
  }, [inventory, shoppingList, impact, isClient]);

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "addedAt">) => {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString()
    };
    setInventory((prev) => [...prev, newItem]);
  };

  const removeInventoryItem = (id: string, used: boolean) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    if (used) {
        // Average assumptions: $2.50 saved per item, 0.5kg CO2
        setImpact(prev => ({
            moneySaved: prev.moneySaved + 2.5,
            co2Saved: prev.co2Saved + 0.5
        }));
    }
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const moveToInventory = (shoppingItemId: string, expiryDays: number = 7) => {
    const item = shoppingList.find(i => i.id === shoppingItemId);
    // Don't add to inventory if we couldn't find the item
    if (!item) return;
    
    // Remove from shopping list
    setShoppingList(prev => prev.filter(i => i.id !== shoppingItemId));
    
    // Add to inventory
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    addInventoryItem({
      name: item.name,
      quantity: item.quantity,
      category: item.category || "Uncategorized",
      expiryDate: expiryDate.toISOString()
    });
  };

  if (!isClient) {
    return null; // Avoid hydration mismatch on first render
  }

  return (
    <AppContext.Provider value={{ 
        inventory, setInventory, 
        shoppingList, setShoppingList, 
        impact, setImpact,
        addInventoryItem, removeInventoryItem, moveToInventory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
