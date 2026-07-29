import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Sparkles, Rocket, Zap } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] relative">
      {/* Animated Top Border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 animate-gradient-x" />
      
      <nav className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-2xl bg-black/60">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/static/logo.png" alt="KyyToAPK" className="w-8 h-8 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] group-hover:scale-110 transition-all duration-300" />
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight">KyyToAPK</span>
                <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 text-[10px] font-bold gap-1">
                  <Sparkles className="w-3 h-3" /> SUPER v2.0
                </Badge>
              </div>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="hidden md:flex items-center gap-1 text-xs">
              <Link href="/builder" className="px-4 py-1.5 rounded-full bg-white text-black font-bold flex items-center gap-1.5">
                <Rocket className="w-3 h-3" /> Builder Super
              </Link>
              <Link href="/my-apks" className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition">My APKs</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Builder Engine Online
            </div>
            <Button variant="outline" size="sm" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 gap-2">
              <Github className="w-4 h-4" /> GitHub
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span className="text-[10px]">2.3k ⭐</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto">
        {children}
      </div>
    </div>
  );
}
