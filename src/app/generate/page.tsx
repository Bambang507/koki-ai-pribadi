"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Utensils, ChefHat, RefreshCw, ArrowLeft, Flame, Clock, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const COMMON_INGREDIENTS = [
  { id: "telur", label: "Telur" },
  { id: "ayam", label: "Daging Ayam" },
  { id: "daging_sapi", label: "Daging Sapi" },
  { id: "ikan", label: "Ikan / Seafood" },
  { id: "nasi", label: "Nasi Putih" },
  { id: "sayur", label: "Sayuran" },
  { id: "tahu_tempe", label: "Tahu / Tempe" },
  { id: "mie", label: "Mie / Pasta" },
];

interface Ingredient {
  name: string;
  quantity: string;
}

interface Instruction {
  stepNumber: number;
  description: string;
}

interface RecipePlan {
  dishName: string;
  description: string;
  prepTime: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export default function GeneratePage() {
  const [craving, setCraving] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipePlan | null>(null);
  const [error, setError] = useState("");

  const handleToggle = (label: string) => {
    setAvailableIngredients((prev) => 
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const handleGenerate = async () => {
    if (!craving.trim()) {
      setError("Beritahu Chef apa yang ingin Anda makan hari ini.");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/v1/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ craving, availableIngredients })
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Terdapat masalah pada server. Silakan coba lagi.");
      }
      
      if (!res.ok) throw new Error(data.error || "Gagal menyusun resep.");
      
      setRecipe(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyusun resep.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-6 bg-background relative overflow-x-hidden min-h-screen">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-3xl z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-orange-500 transition-colors mb-8 text-sm font-semibold tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dapur
        </Link>
        
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground flex items-center justify-center gap-3 tracking-tight mb-3">
            <ChefHat className="text-orange-500 w-10 h-10" /> Koki AI Pribadi
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto">
            Beri tahu seleramu, pilih bahan yang ada, dan biarkan Koki AI meracik keajaiban di dapurmu.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!recipe && !loading && (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <Card className="bg-white/80 border-orange-100 shadow-xl shadow-orange-900/5 backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-10">
                  {/* Craving Input */}
                  <div className="space-y-4">
                    <Label htmlFor="craving" className="text-foreground font-bold text-base">
                      Mau makan apa hari ini? <span className="text-orange-500">*</span>
                    </Label>
                    <Input 
                      id="craving" 
                      placeholder="Contoh: Nasi Goreng Spesial, Pasta Carbonara Creamy..." 
                      className="bg-white border-orange-200 text-foreground focus-visible:ring-orange-500 focus-visible:border-orange-500 h-14 text-lg rounded-2xl shadow-sm placeholder:text-muted-foreground/60 transition-all"
                      value={craving}
                      onChange={(e) => setCraving(e.target.value)}
                    />
                  </div>

                  {/* Ingredients Tags */}
                  <div className="space-y-4">
                    <Label className="text-foreground font-bold text-base">
                      Bahan di Kulkas (Opsional)
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">Pilih bahan yang sudah Anda miliki agar AI dapat menyesuaikan resep.</p>
                    <div className="flex flex-wrap gap-3">
                      {COMMON_INGREDIENTS.map((ing) => {
                        const isSelected = availableIngredients.includes(ing.label);
                        return (
                          <button
                            key={ing.id}
                            onClick={() => handleToggle(ing.label)}
                            className={`flex items-center px-4 py-2 rounded-full border transition-all duration-200 text-sm font-semibold ${
                              isSelected 
                                ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20 scale-105" 
                                : "bg-white border-orange-200 text-foreground hover:border-orange-400 hover:bg-orange-50"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 mr-2" />}
                            {ing.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {error && (
                    <Alert className="bg-red-50 border-red-200 text-red-600 rounded-2xl">
                      <AlertDescription className="font-semibold">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading || !craving.trim()} 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-7 text-lg rounded-2xl shadow-xl shadow-orange-500/25 transition-all"
                  >
                    Mulai Meracik Resep
                    <Utensils className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse" />
                <ChefHat className="w-20 h-20 text-orange-500 animate-bounce relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Koki AI Sedang Memasak...</h3>
              <p className="text-muted-foreground font-medium mb-10 text-center max-w-md">
                Menyusun takaran bumbu dan langkah yang sempurna untuk sajian Anda.
              </p>
              <div className="w-full max-w-lg space-y-5">
                <Skeleton className="h-16 w-full rounded-2xl bg-orange-100/50" />
                <Skeleton className="h-16 w-full rounded-2xl bg-orange-100/50" />
                <Skeleton className="h-24 w-full rounded-2xl bg-orange-100/50" />
              </div>
            </motion.div>
          )}

          {recipe && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-6 pb-12">
              <Card className="bg-white border-orange-100 shadow-2xl shadow-orange-900/5 rounded-3xl overflow-hidden relative">
                
                {/* Recipe Header */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 p-8 md:p-10 border-b border-orange-100 relative overflow-hidden">
                  <Flame className="absolute -bottom-10 -right-10 w-64 h-64 text-orange-500/5 rotate-12" />
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4 relative z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs tracking-wide">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> RESEP SIAP
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-orange-200 text-foreground font-semibold text-xs tracking-wide shadow-sm">
                      <Clock className="w-3 h-3 mr-1 text-orange-500" /> {recipe.prepTime || "30 Menit"}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 relative z-10 leading-tight">
                    {recipe.dishName}
                  </h2>
                  <p className="text-muted-foreground md:text-lg max-w-2xl relative z-10 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
                
                <CardContent className="p-8 md:p-10">
                  {/* Ingredients Section */}
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl mr-3">
                        <Utensils className="w-5 h-5" />
                      </div>
                      Bahan - Bahan
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recipe.ingredients?.map((ing, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-orange-50/50 border border-orange-100 rounded-2xl hover:bg-orange-50 transition-colors">
                          <span className="font-semibold text-foreground">{ing.name}</span>
                          <span className="text-orange-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm text-sm">
                            {ing.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions Section */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-xl mr-3">
                        <Flame className="w-5 h-5" />
                      </div>
                      Cara Memasak
                    </h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-200 before:to-transparent">
                      {recipe.instructions?.map((inst, idx) => (
                        <div key={idx} className="relative flex items-start md:justify-between gap-6">
                          <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white font-black text-lg shadow-lg shadow-orange-500/30 z-10">
                            {inst.stepNumber || idx + 1}
                          </div>
                          <div className="flex-1 bg-white border border-orange-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                            <p className="text-foreground leading-relaxed text-[15px] md:text-base">
                              {inst.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                {/* Action Footer */}
                <div className="p-8 bg-orange-50/50 border-t border-orange-100 flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="bg-white border-orange-200 text-foreground hover:bg-orange-50 hover:text-orange-600 font-semibold py-6 px-8 rounded-2xl shadow-sm transition-all text-base" 
                    onClick={() => setRecipe(null)}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" /> Racik Resep Lain
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
