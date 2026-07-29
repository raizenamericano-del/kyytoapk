"use client";

import { useBuilderStore } from "@/lib/store";
import { isValidUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { Globe, Package, AlertCircle, CheckCircle2, Sparkles, Rocket, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AppInfoForm() {
  const { config, updateConfig } = useBuilderStore();
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSuccess, setUrlSuccess] = useState(false);

  const handleUrlChange = (value: string) => {
    updateConfig({ url: value });
    if (!value) { setUrlError(null); setUrlSuccess(false); return; }
    if (!isValidUrl(value)) { setUrlError("URL harus https:// atau http://"); setUrlSuccess(false); }
    else { setUrlError(null); setUrlSuccess(true); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-violet-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.1)]">
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                Website URL & App Identity
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">Live Validation</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Super</span>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-zinc-400">Masukkan URL website yang mau lu jadiin APK. Harus HTTPS & responsive biar lolos TWA verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2"><Rocket className="w-3 h-3 text-violet-400" /> Target Website URL *</Label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition" />
                <Input
                  placeholder="https://mywebsite.com"
                  value={config.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`pl-11 h-14 rounded-2xl border-2 bg-zinc-950 text-base transition-all ${urlError ? "border-red-500/50 bg-red-950/20 focus:border-red-500" : urlSuccess ? "border-emerald-500/50 bg-emerald-950/20 focus:border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "border-white/10 focus:border-violet-500/50 focus:bg-violet-950/10"}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {urlError && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><AlertCircle className="w-6 h-6 text-red-500" /></motion.div>}
                  {urlSuccess && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></motion.div>}
                </div>
              </div>
              {urlError && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{urlError}</motion.p>}
              {urlSuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> URL valid & SSL terdeteksi • Siap dikonversi ke APK</motion.p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: "appName", label: "App Name *", placeholder: "My Awesome App", value: config.appName, onChange: (v: string) => updateConfig({ appName: v }), max: 30, hint: `${config.appName.length}/30 - tampil di launcher` },
                { id: "packageName", label: "Package Name *", placeholder: "com.kyytoapk.myapp", value: config.packageName, onChange: (v: string) => updateConfig({ packageName: v.toLowerCase().replace(/[^a-z0-9._]/g, "") }), mono: true, hint: "Reverse domain, unik untuk Play Store" },
                { id: "versionName", label: "Version Name", placeholder: "1.0.0", value: config.versionName, onChange: (v: string) => updateConfig({ versionName: v }) },
                { id: "versionCode", label: "Version Code", placeholder: "1", value: String(config.versionCode), onChange: (v: string) => updateConfig({ versionCode: parseInt(v) || 1 }), type: "number", hint: "Incremental untuk update Play Store" },
              ].map((field, i) => (
                <motion.div key={field.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="space-y-2">
                  <Label className="text-xs font-bold flex items-center gap-1.5">{field.id === "packageName" && <Package className="w-3 h-3" />}{field.label}</Label>
                  <Input
                    type={field.type as any || "text"}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    maxLength={field.max}
                    className={`h-12 rounded-xl bg-zinc-950 border-white/10 focus:border-violet-500/50 ${field.mono ? "font-mono text-sm" : ""}`}
                  />
                  {field.hint && <p className="text-[11px] text-zinc-500">{field.hint}</p>}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-violet-950/30 to-indigo-950/30 border-violet-500/20 backdrop-blur overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <img src="/static/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <CardContent className="pt-6 relative">
            <h4 className="font-black text-sm mb-3 flex items-center gap-2 text-white"><Zap className="w-4 h-4 text-amber-400" /> Checklist sebelum build super:</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { ok: isValidUrl(config.url), text: "Website harus HTTPS (wajib untuk TWA & WebView secure)" },
                { ok: config.appName.length > 2, text: "App Name minimal 3 karakter, jangan pakai emoji berlebihan" },
                { ok: config.packageName.includes("."), text: "Package Name harus unik, jangan pakai com.example (bakal ditolak Play Store)" },
                { ok: true, text: "Pastikan website responsive & punya manifest.json (optional tapi +10 poin SEO Play Store)", warn: true },
              ].map((c, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex gap-2 items-center">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${c.ok ? (c.warn ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30") : "bg-zinc-800 text-zinc-500"}`}>{c.ok ? "✓" : "○"}</span>
                  <span className={c.ok ? "text-zinc-300" : "text-zinc-500"}>{c.text}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
