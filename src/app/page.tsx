"use client";

import { motion } from "framer-motion";
import { ArrowRight, Utensils, ChefHat, Flame, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
      {/* Background soft gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-amber-400/10 blur-[80px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center max-w-5xl mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Badge variant="outline" className="mb-8 bg-white/50 backdrop-blur-md border-orange-200 text-orange-600 py-1.5 px-5 shadow-sm text-sm font-medium tracking-wide rounded-full">
            <Flame className="w-4 h-4 mr-2 text-orange-500" />
            Didukung oleh AI Gemini
          </Badge>
          
          <h1 className="font-sans text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            Masakan Enak. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Tanpa Pusing.
            </span>
          </h1>
          
          <p className="font-sans text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Punya bahan sisa di kulkas tapi bingung mau masak apa? Beritahu Chef AI, dan temukan resep lezat sekelas restoran hanya dalam hitungan detik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/generate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all px-8 py-6 text-lg font-semibold rounded-full h-auto">
                Mulai Memasak
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Row */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32"
        >
          {[
            { icon: Utensils, title: "Resep Personal", desc: "Sampaikan selera atau bahan yang Anda miliki, AI akan menyusun resep yang paling pas untuk Anda." },
            { icon: ChefHat, title: "Rasa Bintang 5", desc: "Tingkatkan level masakan rumahan dengan panduan langkah demi langkah dan sentuhan rasa berkelas." },
            { icon: Clock, title: "Cepat & Praktis", desc: "Tidak perlu membuang waktu memikirkan menu. Dapatkan inspirasi hidangan lezat seketika." }
          ].map((feature, i) => (
            <Card key={i} className="bg-white/60 border-orange-100 backdrop-blur-xl shadow-xl shadow-orange-900/5 hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="p-4 bg-orange-50 rounded-2xl text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-xl font-bold text-foreground tracking-tight mb-3">{feature.title}</h3>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
