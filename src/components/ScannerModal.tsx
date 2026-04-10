"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, X, Loader2, Check } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

interface ScannerModalProps {
  onClose: () => void;
}

export default function ScannerModal({ onClose }: ScannerModalProps) {
  const { addInventoryItem } = useAppContext();
  const [step, setStep] = useState<"capture" | "analyzing" | "review">("capture");
  const [detectedItems, setDetectedItems] = useState([
    { id: 1, name: "Milk", quantity: "1 gal", days: 7, category: "Dairy" },
    { id: 2, name: "Spinach", quantity: "1 bag", days: 4, category: "Produce" },
    { id: 3, name: "Carrots", quantity: "5", days: 14, category: "Produce" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input
  const handleCapture = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  // When a file is "selected", move to analyzing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep("analyzing");
      // Simulate AI processing time
      setTimeout(() => {
        setStep("review");
      }, 2500);
    }
  };

  const handleUpdateItem = (id: number, field: string, value: string | number) => {
    setDetectedItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveItem = (id: number) => {
    setDetectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirm = () => {
    detectedItems.forEach(item => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + item.days);
      
      addInventoryItem({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        expiryDate: expiryDate.toISOString()
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white animate-in slide-in-from-bottom-full duration-300">
      
      <header className="flex justify-between items-center p-4">
        <h2 className="font-bold text-lg">Smart Scanner</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white">
          <X size={20} />
        </button>
      </header>

      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <div className="flex-1 overflow-y-auto px-4 pb-20 flex outline-none">
        {step === "capture" && (
          <div className="m-auto w-full max-w-sm flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
               <div className="w-24 h-24 bg-brand/20 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={48} />
               </div>
               <h3 className="text-2xl font-bold">Scan Your Fridge</h3>
               <p className="text-slate-400">Take a photo and our AI will automatically identify ingredients and expiration dates.</p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-8">
              <button onClick={handleCapture} className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors active:opacity-80">
                <Camera size={20} /> Take Photo
              </button>
              <button onClick={handleCapture} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors active:opacity-80">
                <ImageIcon size={20} /> Upload from Gallery
              </button>
            </div>
          </div>
        )}

        {step === "analyzing" && (
          <div className="m-auto flex flex-col items-center justify-center gap-6 text-center">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-slate-700 rounded-full flex items-center justify-center">
                 <Loader2 size={48} className="text-brand animate-spin" />
              </div>
              <div className="absolute inset-0 bg-brand/20 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Image...</h3>
              <p className="text-brand-light animate-pulse">Running advanced Vision AI model</p>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="w-full max-w-sm mx-auto flex flex-col animate-in fade-in zoom-in-95 mt-4">
             <div className="mb-6">
               <h3 className="text-2xl font-bold mb-1">Review Items</h3>
               <p className="text-slate-400 text-sm">We found these items in your photo. Edit them if needed.</p>
             </div>

             <div className="space-y-4">
               {detectedItems.length === 0 ? (
                 <p className="text-center text-slate-500 py-4">No items remaining. Scan again?</p>
               ) : (
                 detectedItems.map(item => (
                   <div key={item.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3">
                      <div className="flex justify-between">
                         <input 
                           type="text" 
                           value={item.name} 
                           onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                           className="bg-transparent border-b border-slate-600 focus:border-brand outline-none text-lg font-semibold w-1/2 pb-1"
                         />
                         <input 
                           type="text" 
                           value={item.quantity || ""} 
                           placeholder="Qty"
                           onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                           className="bg-transparent border-b border-slate-600 focus:border-brand outline-none text-right font-medium w-1/4 pb-1"
                         />
                         <button onClick={() => handleRemoveItem(item.id)} className="text-slate-500 hover:text-status-danger">
                           <X size={20} />
                         </button>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-xs text-slate-400 block mb-1">Category</label>
                           <input 
                              type="text" 
                              value={item.category} 
                              onChange={(e) => handleUpdateItem(item.id, "category", e.target.value)}
                              className="bg-slate-900 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-brand"
                           />
                        </div>
                        <div className="w-24">
                           <label className="text-xs text-slate-400 block mb-1">Days Left</label>
                           <input 
                              type="number" 
                              value={item.days} 
                              onChange={(e) => handleUpdateItem(item.id, "days", parseInt(e.target.value) || 0)}
                              className="bg-slate-900 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-brand text-center text-brand"
                           />
                        </div>
                      </div>
                   </div>
                 ))
               )}
             </div>

             <div className="mt-8 mb-6 pt-4 border-t border-slate-800">
                <button 
                  onClick={handleConfirm}
                  disabled={detectedItems.length === 0}
                  className="w-full bg-brand text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-transform disabled:opacity-50"
                >
                  <Check size={20} /> Add {detectedItems.length} Items to Fridge
                </button>
                <button 
                  onClick={() => setStep("capture")}
                  className="w-full mt-3 text-slate-400 font-medium py-3 rounded-xl active:bg-slate-800 transition-colors"
                >
                  Scan Again
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
