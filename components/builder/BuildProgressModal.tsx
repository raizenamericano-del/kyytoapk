"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Package, FileCode, CheckCircle, XCircle, Clock, Terminal, Copy, Rocket, PartyPopper, Sparkles, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface BuildProgressProps {
  buildId: string;
  onClose?: () => void;
  onComplete?: (data: any) => void;
}

type BuildStatus = "queued" | "validating" | "injecting" | "compiling" | "signing" | "ready" | "failed";

interface StatusData {
  id: string;
  status: BuildStatus;
  progress: number;
  message: string;
  logs: string[];
  downloadUrl?: string;
  sourceZipUrl?: string;
  error?: string;
}

export default function BuildProgressModal({ buildId, onClose, onComplete }: BuildProgressProps) {
  const [data, setData] = useState<StatusData | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!buildId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/status/${buildId}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) return;
          throw new Error("Failed to fetch");
        }
        const json = await res.json();
        setData(json);

        if (json.status === "ready") {
          setIsPolling(false);
          setConfetti(true);
          if (onComplete) onComplete(json);
        } else if (json.status === "failed") {
          setIsPolling(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchStatus();
    const interval = setInterval(() => {
      if (isPolling) fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [buildId, isPolling, onComplete]);

  const getStatusIcon = (status: BuildStatus) => {
    switch (status) {
      case "queued": return <Clock className="w-4 h-4" />;
      case "validating": return <Terminal className="w-4 h-4 animate-pulse" />;
      case "injecting": return <Package className="w-4 h-4 animate-pulse" />;
      case "compiling": return <Cpu className="w-4 h-4 animate-spin" />;
      case "signing": return <Package className="w-4 h-4 animate-bounce" />;
      case "ready": return <CheckCircle className="w-5 h-5 text-white" />;
      case "failed": return <XCircle className="w-5 h-5 text-white" />;
    }
  };

  if (!data) {
    return (
      <Card className="w-full max-w-lg mx-auto bg-black/60 backdrop-blur-xl border-white/10 overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <img src="/static/logo.png" alt="logo" className="absolute inset-1 w-10 h-10 rounded-full" />
          </div>
          <p className="mt-4 text-sm text-zinc-300 font-mono animate-pulse">Preparing build pipeline...</p>
          <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: "50%" }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isReady = data.status === "ready";
  const isFailed = data.status === "failed";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-full max-w-2xl mx-auto relative">
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-[2rem]">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 400, rotate: 0, opacity: 1 }}
              animate={{ y: 500, rotate: 720, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, delay: i * 0.05 }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: ["#7C3AED", "#6366F1", "#EC4899", "#10B981", "#F59E0B"][i % 5], left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      <Card className="overflow-hidden border-2 border-violet-500/30 shadow-[0_0_80px_rgba(124,58,237,0.3)] bg-black">
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600" />
        
        <CardHeader className="bg-gradient-to-br from-zinc-950 to-black text-white border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src="/static/abstract-mesh.png" alt="mesh" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base">
              <motion.div animate={isReady ? {} : { rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className={`p-2.5 rounded-xl ${isReady ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : isFailed ? "bg-red-500" : "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_20px_rgba(124,58,237,0.5)]"}`}>
                {getStatusIcon(data.status)}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">Build Engine <Sparkles className="w-4 h-4 text-amber-400" /></div>
                <p className="text-[11px] font-normal text-zinc-400 font-mono">Android SDK 34 • Gradle 8.5 • Production</p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <img src="/static/logo.png" alt="logo" className="w-8 h-8 rounded-lg border border-white/10" />
              <Badge className={`${isReady ? "bg-emerald-500 text-white" : "bg-violet-600 text-white"} font-mono text-xs px-3 py-1 rounded-full`}>
                {data.progress}%
              </Badge>
            </div>
          </div>

          <div className="relative mt-5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500 font-mono flex items-center gap-2"><Rocket className="w-3 h-3" /> Build ID: {data.id.slice(0, 16)}</span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-zinc-300">{data.status}</span>
            </div>
            
            <div className="relative h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-1">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 relative overflow-hidden" style={{ width: `${data.progress}%` }} initial={{ width: 0 }} animate={{ width: `${data.progress}%` }} transition={{ type: "spring", stiffness: 50 }}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1, repeat: Infinity }} />
              </motion.div>
            </div>

            <motion.p key={data.message} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-zinc-200 flex items-center gap-2 font-medium">
              <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-2 bg-violet-500 rounded-full" />
              {data.message}
            </motion.p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="bg-[#050507] p-4 h-56 overflow-y-auto font-mono text-[11px] relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
              <span className="text-zinc-500 text-[10px] flex items-center gap-2"><Terminal className="w-3 h-3" /> build output</span>
              <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-500">Live</div>
            </div>
            
            <div className="pt-10 space-y-1.5">
              {data.logs.slice(-12).map((log, i) => {
                const cleanLog = log.replace(/\[.*?\]\s?/, '').replace(/\(KV.*?\)/, '').replace(/\(v2\..*?\)/, '').trim();
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 hover:bg-white/[0.03] px-2 py-0.5 rounded">
                    <span className="text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-zinc-400">{cleanLog}</span>
                  </motion.div>
                );
              })}
              {isPolling && (
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-zinc-500 flex items-center gap-2 px-2">
                  <span className="w-2 h-2 bg-zinc-500 rounded-full animate-ping" /> Waiting for next update...
                </motion.div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4 bg-gradient-to-br from-zinc-950 to-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="/static/build-engine.png" alt="engine" className="w-full h-full object-cover" />
            </div>

            <div className="relative">
              {isReady && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-500/30">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl" />
                    <div className="relative flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        <PartyPopper className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-emerald-300 font-bold">Build Completed Successfully</div>
                        <p className="text-xs text-emerald-400/80 mt-1 leading-relaxed">Your APK has been compiled, signed, and optimized. Ready to install on Android devices or upload to Google Play Console.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full h-14 rounded-2xl text-white font-bold gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(124,58,237,0.4)] text-base" onClick={() => window.open(data.downloadUrl || `/api/download/${data.id}`, "_blank")}>
                        <Download className="w-5 h-5" /> Download APK
                      </Button>
                    </motion.div>
                    <Button variant="outline" className="h-14 rounded-2xl gap-2 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur" onClick={() => window.open(data.sourceZipUrl || "#", "_blank")}>
                      <FileCode className="w-4 h-4" /> View Release
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-white font-bold">SDK 34</div><div className="text-zinc-500">Target</div></div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-white font-bold">ARM64</div><div className="text-zinc-500">Optimized</div></div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center"><div className="text-white font-bold">Signed</div><div className="text-zinc-500">Verified</div></div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <Button variant="ghost" size="sm" className="gap-1 text-zinc-400 hover:text-white" onClick={() => navigator.clipboard.writeText(data.id)}>
                      <Copy className="w-3 h-3" /> Copy ID
                    </Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" onClick={onClose}>Build New App</Button>
                  </div>
                </motion.div>
              )}

              {isFailed && (
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30">
                  <p className="font-bold text-sm text-red-300 flex items-center gap-2"><XCircle className="w-4 h-4" /> Build Failed</p>
                  <p className="text-xs text-red-400/80 mt-1">{data.error || "An unexpected error occurred during the build. Please check the logs and try again."}</p>
                  <Button variant="outline" size="sm" className="mt-3 border-red-500/30 text-red-300 hover:bg-red-500/10" onClick={() => setIsPolling(true)}>Retry Build</Button>
                </div>
              )}

              {!isReady && !isFailed && (
                <div className="space-y-3 text-center py-2">
                  <div className="flex items-center justify-center gap-3 text-sm text-zinc-300">
                    <img src="/static/logo.png" alt="logo" className="w-6 h-6 rounded-lg animate-spin" style={{ animationDuration: "3s" }} />
                    <span>Building your application...</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">This usually takes 2-4 minutes. You can leave this page and check your build history later.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
