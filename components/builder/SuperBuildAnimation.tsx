"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Cpu, Shield, Zap, Code2, Download, Smartphone } from "lucide-react";

const steps = [
  { id: "validating", label: "Validating URL", icon: Shield, color: "from-blue-500 to-cyan-500", duration: 1.2 },
  { id: "parsing", label: "Parsing Config", icon: Code2, color: "from-violet-500 to-purple-500", duration: 1 },
  { id: "assets", label: "Generating Icons", icon: Smartphone, color: "from-fuchsia-500 to-pink-500", duration: 1.5 },
  { id: "injecting", label: "Applying Theme", icon: Zap, color: "from-amber-500 to-orange-500", duration: 1 },
  { id: "compiling", label: "Compiling APK", icon: Cpu, color: "from-emerald-500 to-teal-500", duration: 2.5 },
  { id: "signing", label: "Signing & Optimizing", icon: Package, color: "from-indigo-500 to-violet-500", duration: 1 },
];

export default function SuperBuildAnimation({ currentStatus, progress }: { currentStatus: string; progress: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const statusMap: any = {
      queued: 0,
      validating: 0,
      injecting: 2,
      compiling: 4,
      signing: 5,
      ready: 6,
    };
    setActiveIndex(statusMap[currentStatus] ?? 0);
  }, [currentStatus]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-black border border-white/10 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="/static/logo.png" alt="logo" className="w-10 h-10 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.5)]" />
          <div>
            <h3 className="font-bold text-white">Build Engine</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Gradle • SDK 34 • Zipalign</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono tracking-wider">{progress < 100 ? "BUILDING" : "READY"}</span>
        </div>
      </div>

      <div className="relative flex justify-center mb-8">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] blur-[30px]"
          />

          <motion.div
            animate={{ y: [0, -8, 0], rotateY: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[200px] h-[400px] bg-black rounded-[2.2rem] p-2 border-[4px] border-zinc-800 shadow-2xl"
            style={{ perspective: 1000 }}
          >
            <div className="w-full h-full bg-[#0a0a0b] rounded-[1.8rem] overflow-hidden relative flex flex-col items-center justify-center p-4">
              <img src="/static/build-engine.png" alt="build" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="relative z-10 text-center space-y-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center"
                >
                  <Cpu className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-white font-bold text-sm">{progress}%</div>
                <div className="text-[10px] text-zinc-400 tracking-widest uppercase">{currentStatus}</div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                    style={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full" />
          </motion.div>

          {particles.slice(0, 8).map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-violet-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
              style={{ left: "50%", top: "50%", transformOrigin: `${60 + i * 10}px 0px` }}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10 hidden md:block" />
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 hidden md:block"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8 }}
        />

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
          {steps.map((step, idx) => {
            const isActive = idx === activeIndex;
            const isDone = idx < activeIndex;
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-3 rounded-2xl border text-center transition-all duration-500 ${
                  isActive
                    ? "bg-white/10 border-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-105"
                    : isDone
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-zinc-900/50 border-white/5 opacity-60"
                }`}
              >
                <div className="relative mx-auto w-10 h-10 mb-2">
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color}`}
                    />
                  )}
                  <div className={`relative w-full h-full rounded-xl flex items-center justify-center ${isDone ? "bg-emerald-500 text-white" : isActive ? `bg-gradient-to-br ${step.color} text-white shadow-lg` : "bg-zinc-800 text-zinc-500"}`}>
                    {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                </div>
                <p className={`text-[10px] font-medium leading-tight ${isActive ? "text-white" : isDone ? "text-emerald-300" : "text-zinc-500"}`}>{step.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-3 rounded-xl bg-[#050508] border border-white/5 font-mono text-[10px] text-zinc-400">
        <div className="flex items-center gap-2 mb-2 text-zinc-500">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="ml-2">build output</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentStatus} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-zinc-400">
            ▶ {currentStatus} • {progress}% • {currentStatus === "compiling" ? "Gradle task running" : "done"}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
