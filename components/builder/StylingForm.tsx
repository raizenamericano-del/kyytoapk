"use client";

import { useBuilderStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Palette, Image as ImageIcon, Sparkles, Upload, Zap, Layers } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function StylingForm() {
  const { config, updateConfig, updateNested } = useBuilderStore();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const splashLogoRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(config.icon);
  const [splashPreview, setSplashPreview] = useState<string | null>(config.splashConfig.logo);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "icon" | "splash") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max 2MB!"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (type === "icon") { setIconPreview(base64); updateConfig({ icon: base64 }); }
      else { setSplashPreview(base64); updateNested("splashConfig", { logo: base64 }); }
    };
    reader.readAsDataURL(file);
  };

  const mipmapSizes = [
    { label: "HDPI", size: "72x72", color: "bg-blue-500/20 text-blue-300" },
    { label: "XHDPI", size: "96x96", color: "bg-violet-500/20 text-violet-300" },
    { label: "XXHDPI", size: "144x144", color: "bg-fuchsia-500/20 text-fuchsia-300" },
    { label: "XXXHDPI", size: "192x192", color: "bg-emerald-500/20 text-emerald-300" },
    { label: "Play Store", size: "512x512", color: "bg-amber-500/20 text-amber-300" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border-violet-500/20 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              App Icon & Super Branding
              <div className="text-[11px] font-normal text-zinc-400 mt-1">Upload PNG 512x512 • Auto mipmap • Super resizer</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="font-bold flex items-center gap-2"><Upload className="w-3 h-3" /> Launcher Icon *</Label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => iconInputRef.current?.click()} className="group relative w-full h-44 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all overflow-hidden bg-zinc-950">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <img src="/static/abstract-mesh.png" alt="mesh" className="w-full h-full object-cover opacity-20" />
                </div>
                {iconPreview ? (
                  <>
                    <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={iconPreview} alt="icon" className="relative w-24 h-24 rounded-2xl object-cover shadow-[0_0_30px_rgba(124,58,237,0.4)] border-2 border-white/10" />
                    <span className="relative mt-3 text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">Click to replace super icon</span>
                  </>
                ) : (
                  <>
                    <div className="relative w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 transition">
                      <img src="/static/logo.png" alt="default" className="w-10 h-10 rounded-xl opacity-50 group-hover:opacity-100 transition" />
                    </div>
                    <span className="relative mt-3 text-sm font-bold">Upload PNG (512x512)</span>
                    <span className="relative text-[11px] text-zinc-500">Max 2MB, transparan recommended</span>
                    <span className="relative mt-2 text-[10px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">Super auto-resize</span>
                  </>
                )}
              </motion.div>
              <input ref={iconInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, "icon")} />
              <div className="flex gap-2 flex-wrap">
                {mipmapSizes.map((m) => (
                  <span key={m.label} className={`text-[10px] px-2.5 py-1 rounded-full border border-white/10 ${m.color} font-bold`}>{m.label}: {m.size}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Primary Theme", value: config.primaryColor, onChange: (v: string) => updateConfig({ primaryColor: v }) },
                { label: "Navigation Bar", value: config.navBarColor, onChange: (v: string) => updateConfig({ navBarColor: v }) },
                { label: "Background", value: config.backgroundColor, onChange: (v: string) => updateConfig({ backgroundColor: v }) },
              ].map((c) => (
                <div key={c.label} className="space-y-2">
                  <Label className="text-xs font-bold flex items-center gap-2"><Palette className="w-3 h-3 text-violet-400" /> {c.label}</Label>
                  <div className="flex gap-2">
                    <div className="relative w-14 h-12 rounded-xl overflow-hidden border-2 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                      <Input type="color" value={c.value} onChange={(e) => c.onChange(e.target.value)} className="absolute inset-[-10px] w-[60px] h-[60px] p-0 border-0 cursor-pointer" />
                    </div>
                    <Input value={c.value} onChange={(e) => c.onChange(e.target.value)} className="flex-1 h-12 rounded-xl bg-zinc-950 border-white/10 font-mono text-sm focus:border-violet-500/50" />
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-4 gap-2 pt-2">
                {["#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#111827", "#FFFFFF", "#EC4899"].map((c) => (
                  <motion.button key={c} whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => updateConfig({ primaryColor: c })} className="w-full h-9 rounded-xl border-2 border-white/20 shadow-lg relative overflow-hidden" style={{ backgroundColor: c }}>
                    {config.primaryColor === c && <div className="absolute inset-0 border-2 border-white rounded-xl" />}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-amber-500/20 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Splash Screen Super Animator
          </CardTitle>
          <CardDescription>Konfigurasi layar loading super keren pas app dibuka, dengan animasi custom</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Splash Background</Label>
                <div className="flex gap-2">
                  <Input type="color" value={config.splashConfig.backgroundColor} onChange={(e) => updateNested("splashConfig", { backgroundColor: e.target.value })} className="w-14 h-12 p-1 rounded-xl bg-zinc-950 border-white/10" />
                  <Input value={config.splashConfig.backgroundColor} onChange={(e) => updateNested("splashConfig", { backgroundColor: e.target.value })} className="flex-1 h-12 rounded-xl bg-zinc-950 border-white/10 font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Splash Logo (pakai App Icon kalau kosong)</Label>
                <motion.div whileHover={{ scale: 1.02 }} onClick={() => splashLogoRef.current?.click()} className="w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-500/5 bg-zinc-950 transition">
                  {splashPreview ? (
                    <img src={splashPreview} alt="splash" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
                  ) : (
                    <div className="text-center">
                      <Layers className="w-6 h-6 mx-auto text-zinc-500 mb-2" />
                      <span className="text-xs text-zinc-500">Upload Splash Logo Super</span>
                    </div>
                  )}
                </motion.div>
                <input ref={splashLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "splash")} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Spinner Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={config.splashConfig.spinnerColor} onChange={(e) => updateNested("splashConfig", { spinnerColor: e.target.value })} className="w-14 h-12 p-1 rounded-xl bg-zinc-950 border-white/10" />
                  <Input value={config.splashConfig.spinnerColor} onChange={(e) => updateNested("splashConfig", { spinnerColor: e.target.value })} className="flex-1 h-12 rounded-xl bg-zinc-950 border-white/10 font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Splash Text</Label>
                <Input value={config.splashConfig.text} onChange={(e) => updateNested("splashConfig", { text: e.target.value })} placeholder="Powered by KyyToAPK Super" className="h-12 rounded-xl bg-zinc-950 border-white/10" />
                <p className="text-[11px] text-zinc-500">Free tier ada branding KyyToAPK • Premium bisa custom/hapus</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-white/10">
                <div>
                  <p className="text-sm font-bold">Show Loading Spinner Super</p>
                  <p className="text-[11px] text-zinc-500">Animasi loading dengan neon glow</p>
                </div>
                <Switch checked={config.splashConfig.showSpinner} onCheckedChange={(v) => updateNested("splashConfig", { showSpinner: v })} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-2"><Zap className="w-3 h-3 text-amber-400" /> Duration: {config.splashConfig.duration}ms</Label>
                <input type="range" min={500} max={5000} step={100} value={config.splashConfig.duration} onChange={(e) => updateNested("splashConfig", { duration: parseInt(e.target.value) })} className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-[10px] text-zinc-500"><span>Cepet</span><span>2.5s Recommended</span><span>Lama</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
