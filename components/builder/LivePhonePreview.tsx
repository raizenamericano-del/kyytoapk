"use client";

import { useBuilderStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, Signal, Wifi, ArrowLeft, MoreVertical, RefreshCw, Globe, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function LivePhonePreview() {
  const { config } = useBuilderStore();
  const [currentUrl, setCurrentUrl] = useState(config.url);
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setCurrentUrl(config.url);
  }, [config.url]);

  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), Math.min(config.splashConfig.duration, 3000));
    return () => clearTimeout(timer);
  }, [config.primaryColor, config.splashConfig.backgroundColor, config.splashConfig.text, config.icon, config.splashConfig.duration]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Glow behind phone */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[3rem] blur-[30px]"
        />

        {/* Phone Frame Super */}
        <motion.div
          initial={{ rotateY: -10, scale: 0.9 }}
          animate={{ rotateY: 0, scale: 1 }}
          whileHover={{ rotateY: 5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative w-[300px] h-[620px] bg-black rounded-[3rem] p-3 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-[6px] border-zinc-900"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Side buttons */}
          <div className="absolute -left-2 top-20 w-1 h-12 bg-zinc-800 rounded-l" />
          <div className="absolute -left-2 top-36 w-1 h-8 bg-zinc-800 rounded-l" />
          <div className="absolute -right-2 top-28 w-1 h-16 bg-zinc-800 rounded-r" />

          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative flex flex-col">
            {/* Status Bar with real logic */}
            <div className="h-7 flex items-center justify-between px-6 text-[10px] font-medium text-white shrink-0" style={{ backgroundColor: config.navBarColor }}>
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-3" />
              </div>
            </div>

            {/* App Bar with gradient */}
            <div className="h-12 flex items-center justify-between px-3 text-white shrink-0 relative overflow-hidden" style={{ backgroundColor: config.primaryColor }}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              <div className="relative flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                {config.icon ? (
                  <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={config.icon} alt="icon" className="w-6 h-6 rounded-full bg-white object-cover shadow" />
                ) : (
                  <img src="/static/logo.png" alt="logo" className="w-6 h-6 rounded-full bg-white object-cover" />
                )}
                <span className="text-sm font-bold truncate max-w-[120px]">{config.appName}</span>
              </div>
              <div className="relative flex items-center gap-2">
                {config.webview.pullToRefresh && (
                  <button onClick={handleRefresh} className="p-1 rounded-full hover:bg-white/10">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                )}
                <MoreVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Web Content */}
            <div className="flex-1 relative bg-white overflow-hidden">
              <AnimatePresence>
                {showSplash && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ backgroundColor: config.splashConfig.backgroundColor }}
                  >
                    {/* Splash animated bg mesh */}
                    <div className="absolute inset-0 opacity-30">
                      <img src="/static/abstract-mesh.png" alt="mesh" className="w-full h-full object-cover" />
                    </div>

                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="relative flex flex-col items-center gap-4">
                      {config.splashConfig.logo || config.icon ? (
                        <motion.img
                          animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          src={config.splashConfig.logo || config.icon || "/static/logo.png"}
                          alt="logo"
                          className="w-24 h-24 rounded-[1.5rem] object-cover shadow-[0_0_40px_rgba(0,0,0,0.3)] bg-white p-1"
                        />
                      ) : (
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-[1.5rem] bg-white/10 backdrop-blur flex items-center justify-center text-3xl font-black text-white border border-white/20 shadow-xl">
                          {config.appName.charAt(0)}
                        </motion.div>
                      )}

                      <div className="text-center space-y-1">
                        <h2 className="text-white font-black text-lg">{config.appName}</h2>
                        <p className="text-white/70 text-[11px]">{config.packageName}</p>
                      </div>

                      {config.splashConfig.showSpinner && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 flex flex-col items-center gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 border-2 border-white/20 rounded-full" />
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-t-white rounded-full" style={{ borderTopColor: config.splashConfig.spinnerColor }} />
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/50 text-[10px] mt-6 tracking-[0.2em] uppercase flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {config.splashConfig.text}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {config.webview.pullToRefresh && isLoading && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-20">
                  <motion.div className="h-full" style={{ backgroundColor: config.primaryColor }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1, repeat: Infinity }} />
                </div>
              )}

              {/* Simulated web */}
              <div className="w-full h-full bg-[#fcfcfc] p-4 overflow-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.primaryColor}15` }}>
                      <Globe className="w-5 h-5" style={{ color: config.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-sm truncate max-w-[180px]">{currentUrl}</h3>
                      <p className="text-[10px] text-zinc-500">Secure • WebView • TWA Ready</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2.5 bg-zinc-200 rounded-full w-3/4" />
                    <div className="h-2.5 bg-zinc-100 rounded-full w-full" />
                    <div className="h-2.5 bg-zinc-100 rounded-full w-5/6" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.div whileHover={{ scale: 1.03 }} className="h-20 rounded-xl border border-zinc-100 bg-white p-2 shadow-sm flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: config.primaryColor }} />
                      <div className="space-y-1">
                        <div className="h-2 bg-zinc-100 rounded w-3/4" />
                        <div className="h-1.5 bg-zinc-50 rounded w-1/2" />
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} className="h-20 rounded-xl border border-zinc-100 bg-zinc-50 p-2">
                      <img src="/static/build-engine.png" alt="mini" className="w-full h-full object-cover rounded-lg opacity-60" />
                    </motion.div>
                  </div>

                  {config.advanced.offlinePage.enabled && (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-[10px] font-bold text-amber-800">{config.advanced.offlinePage.title}</p>
                      <p className="text-[9px] text-amber-700 mt-1">{config.advanced.offlinePage.message}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">Explore</div>
                    <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Permissions */}
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                {config.permissions.camera && <span className="text-[8px] px-2 py-1 bg-black/70 backdrop-blur text-white rounded-full border border-white/10">📷 Camera</span>}
                {config.permissions.geolocation && <span className="text-[8px] px-2 py-1 bg-black/70 backdrop-blur text-white rounded-full border border-white/10">📍 Location</span>}
                {config.advanced.pushNotifications.enabled && <span className="text-[8px] px-2 py-1 bg-black/70 backdrop-blur text-white rounded-full border border-white/10">🔔 Push</span>}
              </div>
            </div>

            <div className="h-6 flex items-center justify-center bg-white border-t border-zinc-100">
              <div className="w-20 h-1 bg-black rounded-full" />
            </div>
          </div>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full border border-zinc-800" />
        </motion.div>
      </div>

      {/* Info Card super */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-[300px] p-3 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white text-xs space-y-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/10" />
        <div className="relative flex justify-between"><span className="text-zinc-400">Package</span><span className="font-mono truncate ml-2 text-[10px]">{config.packageName}</span></div>
        <div className="relative flex justify-between"><span className="text-zinc-400">Version</span><span>{config.versionName} ({config.versionCode})</span></div>
        <div className="relative flex justify-between items-center"><span className="text-zinc-400">Engine</span><span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] border border-violet-500/20 flex items-center gap-1"><img src="/static/logo.png" className="w-3 h-3 rounded-full" alt="k" /> Super v2.0</span></div>
      </motion.div>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSplash(true)} className="text-xs px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition flex items-center gap-2">
        <Sparkles className="w-3 h-3" /> Replay Splash Super
      </motion.button>
    </div>
  );
}
