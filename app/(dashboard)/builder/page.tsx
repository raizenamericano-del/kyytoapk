"use client";

import { useState } from "react";
import { useBuilderStore, BUILD_STEPS } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppInfoForm from "@/components/builder/AppInfoForm";
import StylingForm from "@/components/builder/StylingForm";
import PermissionsForm from "@/components/builder/PermissionsForm";
import LivePhonePreview from "@/components/builder/LivePhonePreview";
import BuildProgressModal from "@/components/builder/BuildProgressModal";
import SuperBuildAnimation from "@/components/builder/SuperBuildAnimation";
import AnimatedBackground from "@/components/ui/animated-background";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Rocket, Sparkles, Crown, Zap, Check, Cpu, Layers, Palette, Shield, PartyPopper } from "lucide-react";
import { isValidUrl } from "@/lib/utils";

export default function SuperBuilderPage() {
  const { config, currentStep, setStep } = useBuilderStore();
  const [buildId, setBuildId] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState("queued");
  const [buildProgress, setBuildProgress] = useState(0);

  const canProceed = () => {
    if (currentStep === 1) return config.appName.length >= 2 && config.packageName.includes(".") && isValidUrl(config.url);
    return true;
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      const res = await fetch("/api/build-apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Build failed");
      setBuildId(data.buildId);
      setBuildStatus("validating");
      setBuildProgress(10);

      const history = JSON.parse(localStorage.getItem("kyy_apks") || "[]");
      history.unshift({
        id: data.buildId,
        appName: config.appName,
        packageName: config.packageName,
        url: config.url,
        icon: config.icon,
        createdAt: Date.now(),
        status: "building",
        mode: data.mode,
      });
      localStorage.setItem("kyy_apks", JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Build error");
      setIsBuilding(false);
    }
  };

  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-56px)] relative">
      <AnimatedBackground />

      <div className="flex-1 p-4 md:p-8 lg:max-w-[720px] xl:max-w-[820px] overflow-y-auto relative z-10">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              <img src="/static/logo.png" alt="logo" className="w-5 h-5 rounded-full" />
              KyyToAPK Builder
            </motion.div>
            <Badge className="bg-white/10 text-white border-white/10">Step {currentStep}/4</Badge>
            {config.tier === "free" && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1">
                <Crown className="w-3 h-3" /> Free Plan
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <motion.div className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600" style={{ width: `${progressPercent}%` }} initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ type: "spring", stiffness: 100 }} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BUILD_STEPS.map((s) => {
                const isActive = currentStep === s.id;
                const isDone = currentStep > s.id;
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left p-3 rounded-2xl border relative overflow-hidden transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-400 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                        : isDone
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-zinc-900/80 border-white/10 text-zinc-500 hover:border-white/20 backdrop-blur"
                    }`}
                  >
                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />}
                    <div className="relative flex items-center gap-2">
                      <span className="text-base">{isDone ? <Check className="w-4 h-4" /> : s.icon}</span>
                      <span className="text-xs font-bold truncate">{s.title}</span>
                    </div>
                    <p className="relative text-[10px] opacity-80 mt-1 hidden md:block truncate">{s.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 30, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -30, scale: 0.98 }} transition={{ duration: 0.4, type: "spring" }}>
            {currentStep === 1 && <AppInfoForm />}
            {currentStep === 2 && <StylingForm />}
            {currentStep === 3 && <PermissionsForm />}
            {currentStep === 4 && (
              <div className="space-y-6">
                {!buildId ? (
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="overflow-hidden border-violet-500/30 bg-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(124,58,237,0.2)]">
                        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600" />
                        <CardContent className="p-6 space-y-5">
                          <div className="flex items-center gap-3">
                            <img src="/static/logo.png" alt="logo" className="w-12 h-12 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.6)]" />
                            <div>
                              <h3 className="text-xl font-black text-white flex items-center gap-2">
                                Ready to Build Your APK <Rocket className="w-5 h-5 text-violet-400" />
                              </h3>
                              <p className="text-xs text-zinc-400">Configure, preview, and generate a production-ready APK in minutes</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              { k: "App Name", v: config.appName, icon: <Palette className="w-3 h-3" /> },
                              { k: "Package", v: config.packageName, icon: <Layers className="w-3 h-3" /> },
                              { k: "URL", v: config.url, icon: <Shield className="w-3 h-3" /> },
                              { k: "Version", v: `${config.versionName} (${config.versionCode})`, icon: <Cpu className="w-3 h-3" /> },
                              { k: "Theme", v: config.primaryColor, icon: <Palette className="w-3 h-3" />, color: true },
                              { k: "Permissions", v: `${Object.values(config.permissions).filter(Boolean).length} enabled`, icon: <Shield className="w-3 h-3" /> },
                            ].map((row, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.06] transition">
                                <span className="text-zinc-400 text-xs flex items-center gap-1.5">{row.icon}{row.k}</span>
                                <span className="text-white text-xs font-bold truncate ml-2 max-w-[140px] flex items-center gap-2">
                                  {row.color && <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: row.v }} />}
                                  {row.v}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          <div className="p-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600">
                            <div className="rounded-[10px] bg-black p-3 flex items-center justify-between text-[11px]">
                              <span className="text-zinc-500 font-mono">Gradle 8.5 • SDK 34 • Signed APK • ~2-4 min</span>
                              <span className="text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Engine Online</span>
                            </div>
                          </div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={handleBuild}
                              disabled={isBuilding || !canProceed()}
                              className="w-full h-16 rounded-2xl text-base font-black gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_50px_rgba(124,58,237,0.6)] disabled:opacity-50"
                            >
                              {isBuilding ? (
                                <>
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                                  Starting Build...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-6 h-6" /> Build APK Now
                                  <Sparkles className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </motion.div>

                          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                            <img src="/static/logo.png" alt="k" className="w-4 h-4 rounded" />
                            Secure build • Zipaligned • Ready for Play Store
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <SuperBuildAnimation currentStatus="queued" progress={0} />

                    <Card className="bg-zinc-900/60 border-white/10 backdrop-blur">
                      <CardContent className="p-4 flex gap-3">
                        <Crown className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">What's included?</h4>
                          <p className="text-xs text-zinc-400">Free builder includes custom icon, splash screen, theme colors, permissions, and signed APK. Upgrade to remove branding and enable custom package name, push notifications, and priority builds.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="space-y-6">
                    <SuperBuildAnimation currentStatus={buildStatus} progress={buildProgress} />
                    <BuildProgressModal
                      buildId={buildId}
                      onClose={() => {
                        setBuildId(null);
                        setIsBuilding(false);
                      }}
                      onComplete={(data) => {
                        setBuildStatus("ready");
                        setBuildProgress(100);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!buildId && (
          <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={() => setStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1} className="rounded-full bg-white/5 border-white/10 backdrop-blur hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {currentStep < 4 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setStep(currentStep + 1)} disabled={!canProceed()} className="rounded-full px-8 bg-gradient-to-r from-violet-600 to-indigo-600 font-bold">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 lg:max-w-[520px] bg-black/40 backdrop-blur-xl border-l border-white/10 p-6 lg:p-8 flex flex-col items-center lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:overflow-auto relative z-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Live Preview
            </div>
            <h3 className="font-black text-white text-lg flex items-center justify-center gap-2">
              <img src="/static/logo.png" alt="logo" className="w-6 h-6 rounded-lg" /> Device Preview
            </h3>
            <p className="text-xs text-zinc-500">Updates instantly as you customize</p>
          </div>

          <LivePhonePreview />

          <div className="grid grid-cols-3 gap-2">
            {[
              { k: config.appName.length, l: "Characters" },
              { k: Object.values(config.permissions).filter(Boolean).length, l: "Permissions" },
              { k: "✓", l: "Ready" },
            ].map((s, i) => (
              <Card key={i} className="bg-zinc-900/60 border-white/5 backdrop-blur">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-black text-white">{s.k}</p>
                  <p className="text-[10px] text-zinc-500">{s.l}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border-violet-500/20 overflow-hidden">
            <CardContent className="p-0">
              <img src="/static/abstract-mesh.png" alt="mesh" className="w-full h-20 object-cover opacity-50" />
              <div className="p-3 -mt-6 relative z-10">
                <p className="text-xs font-bold text-white flex items-center gap-2"><PartyPopper className="w-4 h-4 text-amber-400" /> Build Configuration</p>
                <p className="text-[11px] text-zinc-400 mt-1">Splash {config.splashConfig.duration}ms, pull-to-refresh {config.webview.pullToRefresh ? "enabled" : "disabled"}, zoom {config.webview.enableZoom ? "enabled" : "disabled"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
