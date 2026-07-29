"use client";

import { useBuilderStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, WifiOff, Code2, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PermissionsForm() {
  const { config, updateNested } = useBuilderStore();

  const webviewToggles = [
    { key: "pullToRefresh", label: "Pull to Refresh Super", desc: "Swipe down refresh • Super smooth", pro: false },
    { key: "hardwareBackButton", label: "Hardware Back Handling", desc: "Tombol back Android • Native", pro: false },
    { key: "enableJavaScript", label: "Enable JavaScript", desc: "Wajib aktif untuk website modern", pro: false },
    { key: "enableZoom", label: "Pinch to Zoom", desc: "Izinkan user zoom halaman", pro: false },
    { key: "enableCookies", label: "Enable Cookies", desc: "Cookies & localStorage super", pro: false },
    { key: "enableCache", label: "Cache Storage Super", desc: "Offline super cepat • 10x faster", pro: true },
  ] as const;

  const permissionToggles = [
    { key: "camera", label: "Camera", desc: "CAMERA", icon: "📷", color: "from-violet-500/20 to-indigo-500/20 border-violet-500/20" },
    { key: "microphone", label: "Microphone", desc: "RECORD_AUDIO", icon: "🎙️", color: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/20" },
    { key: "geolocation", label: "Geolocation", desc: "FINE_LOCATION", icon: "📍", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20" },
    { key: "fileUpload", label: "File Upload Super", desc: "FileChooser", icon: "📤", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/20" },
    { key: "fileDownload", label: "File Download", desc: "Download Manager", icon: "📥", color: "from-amber-500/20 to-orange-500/20 border-amber-500/20" },
    { key: "storage", label: "Storage Access", desc: "READ/WRITE", icon: "💾", color: "from-zinc-500/20 to-zinc-600/20 border-zinc-500/20" },
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border-violet-500/20 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              WebView Super Engine
              <div className="text-[11px] font-normal text-zinc-400">Atur perilaku WebView Android super krusial</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {webviewToggles.map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 rounded-2xl border bg-zinc-950/50 border-white/5 hover:border-violet-500/20 hover:bg-zinc-900/50 transition group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white group-hover:text-violet-300 transition">{item.label}</p>
                    {item.pro && <span className="text-[9px] px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold">PRO SUPER</span>}
                    {item.key === "pullToRefresh" && <Sparkles className="w-3 h-3 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-500">{item.desc}</p>
                </div>
                <Switch checked={config.webview[item.key] as boolean} onCheckedChange={(v) => updateNested("webview", { [item.key]: v } as any)} />
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <Label className="text-xs font-bold">External Link Action</Label>
              <select value={config.webview.externalLinks} onChange={(e) => updateNested("webview", { externalLinks: e.target.value as any })} className="w-full h-12 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white focus:border-violet-500/50">
                <option value="browser">Open in Browser (Recommended Super)</option>
                <option value="in-app">Open Inside WebView</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold">Custom User-Agent Super</Label>
              <Input value={config.webview.userAgent} onChange={(e) => updateNested("webview", { userAgent: e.target.value })} className="h-12 rounded-xl bg-zinc-950 border-white/10 font-mono text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-emerald-500/20 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Native Permissions Super
          </CardTitle>
          <CardDescription>Pilih izin super yang dibutuhkan - jangan berlebihan biar lolos Play Store review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {permissionToggles.map((p, i) => (
              <motion.div key={p.key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`flex items-center justify-between p-4 rounded-2xl border bg-gradient-to-br ${p.color} backdrop-blur hover:scale-[1.02] transition-transform`}>
                <div className="flex gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{p.label}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{p.desc}</p>
                  </div>
                </div>
                <Switch checked={config.permissions[p.key] as boolean} onCheckedChange={(v) => updateNested("permissions", { [p.key]: v } as any)} />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Super Tip: Semakin sedikit permission, semakin tinggi rating & kepercayaan user. Hanya aktifkan yang website lu beneran butuh.</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/40 backdrop-blur-xl border-violet-500/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell className="w-4 h-4 text-violet-400" /> Push Super <Badge className="bg-amber-500 text-white text-[10px]">PREMIUM</Badge></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
              <Label className="font-bold">Enable Push Super</Label>
              <Switch checked={config.advanced.pushNotifications.enabled} onCheckedChange={(v) => updateNested("advanced", { pushNotifications: { ...config.advanced.pushNotifications, enabled: v } })} />
            </div>
            {config.advanced.pushNotifications.enabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <select value={config.advanced.pushNotifications.provider} onChange={(e) => updateNested("advanced", { pushNotifications: { ...config.advanced.pushNotifications, provider: e.target.value as any } })} className="w-full h-11 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white">
                  <option value="none">Select Provider Super</option>
                  <option value="onesignal">OneSignal (Recommended Super)</option>
                  <option value="firebase">Firebase FCM</option>
                </select>
                <Input placeholder="OneSignal App ID / FCM Sender ID" value={config.advanced.pushNotifications.appId} onChange={(e) => updateNested("advanced", { pushNotifications: { ...config.advanced.pushNotifications, appId: e.target.value } })} className="h-11 rounded-xl bg-zinc-950 border-white/10" />
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><WifiOff className="w-4 h-4 text-orange-400" /> Offline Super Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-white/5">
              <Label className="font-bold">Custom Offline UI</Label>
              <Switch checked={config.advanced.offlinePage.enabled} onCheckedChange={(v) => updateNested("advanced", { offlinePage: { ...config.advanced.offlinePage, enabled: v } })} />
            </div>
            {config.advanced.offlinePage.enabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <Input placeholder="Offline Title Super" value={config.advanced.offlinePage.title} onChange={(e) => updateNested("advanced", { offlinePage: { ...config.advanced.offlinePage, title: e.target.value } })} className="h-11 rounded-xl bg-zinc-950 border-white/10" />
                <Input placeholder="Offline Message Super" value={config.advanced.offlinePage.message} onChange={(e) => updateNested("advanced", { offlinePage: { ...config.advanced.offlinePage, message: e.target.value } })} className="h-11 rounded-xl bg-zinc-950 border-white/10" />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20"><img src="/static/build-engine.png" alt="code" className="w-full h-full object-cover" /></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-sm"><Code2 className="w-4 h-4" /> Advanced Injection Super (Pro) <Sparkles className="w-3 h-3 text-amber-400" /></CardTitle>
        </CardHeader>
        <CardContent className="relative grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-300 text-xs font-bold">Custom CSS Injection Super</Label>
            <textarea value={config.advanced.customCss} onChange={(e) => updateNested("advanced", { customCss: e.target.value })} placeholder={"/* hide header super */\n.header { display: none !important; }\n/* super branding */"} className="w-full h-28 rounded-xl bg-black border-zinc-800 border p-3 text-xs font-mono text-zinc-300 focus:border-violet-500/50 focus:outline-none" />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300 text-xs font-bold">Custom JS Injection Super</Label>
            <textarea value={config.advanced.customJs} onChange={(e) => updateNested("advanced", { customJs: e.target.value })} placeholder={"console.log('KyyToAPK Super injected');\n// auto hide elements super\n"} className="w-full h-28 rounded-xl bg-black border-zinc-800 border p-3 text-xs font-mono text-zinc-300 focus:border-violet-500/50 focus:outline-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
