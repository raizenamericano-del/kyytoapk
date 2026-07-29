"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedBackground from "@/components/ui/animated-background";
import { Smartphone, Zap, Palette, Shield, Download, Globe, ArrowRight, Play, Check, Sparkles, Layers, Bell, Cpu, Github, Star, Rocket, Code2, Monitor } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function SuperLandingPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Navbar super keren */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl bg-black/20"
      >
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src="/static/logo.png"
              alt="KyyToAPK"
              className="w-10 h-10 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.6)]"
            />
            <div>
              <span className="font-black text-xl tracking-tight">KyyToAPK</span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold">SUPER v2.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/my-apks" className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition group">
              <Code2 className="w-4 h-4 group-hover:text-violet-400 transition" /> My Builds
            </Link>
            <Link href="/builder">
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold gap-2 h-9 px-5">
                <Rocket className="w-4 h-4" /> Launch Builder
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO SUPER ANIMATED */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-20 md:pt-20 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Copy */}
          <motion.div style={{ y, opacity }} className="space-y-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30 text-xs text-violet-200 backdrop-blur"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-emerald-400 rounded-full" />
              <Sparkles className="w-3 h-3" /> NEW: Real GitHub Actions Builder + Super Animations
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-[68px] font-black leading-[0.9] tracking-tighter"
            >
              <span className="block text-white">Web to APK</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-indigo-300 to-fuchsia-300 animate-gradient-x">
                Super Engine
              </span>
              <span className="block text-2xl md:text-[28px] font-normal text-zinc-400 mt-4 tracking-normal leading-tight">
                Build real signed APK from any URL in 2 min. No code, super animated, production-ready.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl"
            >
              Advanced engine pakai <span className="text-white font-semibold">Bubblewrap + TWA + Gradle 34</span> + GitHub Actions. Custom icon mipmap, splash animator, FileChooser, geolocation, push notifications, offline page, custom CSS/JS injection — semua realtime preview.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/builder">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="rounded-full h-14 px-8 text-base font-black bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_40px_rgba(124,58,237,0.5)] gap-2">
                    <Zap className="w-5 h-5" /> Build APK Gratis Sekarang <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Button variant="outline" className="rounded-full h-14 px-7 bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2 backdrop-blur">
                <Play className="w-4 h-4" /> Lihat Demo Build
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 pt-2 text-xs"
            >
              {[
                { icon: <Check className="w-3 h-3" />, text: "No Watermark PRO" },
                { icon: <Shield className="w-3 h-3" />, text: "Signed APK" },
                { icon: <Star className="w-3 h-3" />, text: "Play Store Ready" },
                { icon: <Github className="w-3 h-3" />, text: "Open Builder Engine" },
              ].map((i, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">{i.icon}</span>
                  {i.text}
                </div>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-md"
            >
              {[
                { k: "18K+", v: "APKs Built", sub: "+1.2k today" },
                { k: "4.9/5", v: "Rating", sub: "2.3k reviews" },
                { k: "1.8min", v: "Avg Build", sub: "Fastest engine" },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-2xl font-black text-white">{s.k}</p>
                  <p className="text-xs text-zinc-300 font-medium">{s.v}</p>
                  <p className="text-[10px] text-emerald-400">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Hero Visual Super */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, type: "spring" }}
            className="relative lg:h-[750px] flex items-center justify-center"
          >
            {/* Glow */}
            <div className="absolute w-[700px] h-[700px] bg-gradient-to-br from-violet-600/30 to-indigo-600/30 rounded-full blur-[100px] -z-10" />

            {/* Main hero image */}
            <motion.img
              animate={{ y: [0, -15, 0], rotateY: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src="/static/hero-3d.png"
              alt="KyyToAPK Hero 3D"
              className="relative z-10 w-[90%] max-w-[600px] drop-shadow-[0_0_60px_rgba(124,58,237,0.5)] rounded-[2rem]"
              style={{ transformStyle: "preserve-3d" }}
            />

            {/* Floating code cards */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 -left-4 md:left-0 z-20 hidden md:block"
            >
              <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl w-64">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <img src="/static/logo.png" className="w-6 h-6 rounded-lg" alt="logo" />
                    <span className="text-xs font-bold text-white">TWA Manifest</span>
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div className="font-mono text-[11px] space-y-1 text-zinc-300">
                    <div><span className="text-violet-400">"packageId"</span>: <span className="text-emerald-400">"com.kyytoapk.myapp"</span></div>
                    <div><span className="text-violet-400">"themeColor"</span>: <span className="text-amber-400">"#7C3AED"</span></div>
                    <div><span className="text-violet-400">"compileSdk"</span>: <span className="text-cyan-400">34</span></div>
                    <div className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Manifest injected • 12ms</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-16 -right-2 md:right-10 z-20"
            >
              <Card className="bg-black/70 backdrop-blur-xl border-violet-500/20 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                <CardContent className="p-4 flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Download className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">MyApp.apk <Badge className="bg-emerald-500 text-white text-[9px] h-4">READY</Badge></p>
                    <p className="text-xs text-zinc-400">Signed • 18.4 MB • SDK 34</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                      <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                      <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Build engine mini */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-1/2 -right-10 z-10 hidden lg:block"
            >
              <img src="/static/build-engine.png" alt="engine" className="w-32 h-32 rounded-2xl object-cover border border-white/10 shadow-2xl opacity-80" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features super grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 mb-4 gap-2"><Cpu className="w-3 h-3" /> Engine Super Features</Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Semua yang lu butuhin buat jadi <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Play Store Publisher</span></h2>
          <p className="text-zinc-400">Bukan cuma webview wrapper kaleng-kaleng. Ini full customization engine dengan live preview, mipmap generator, dan GitHub Actions builder beneran.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Palette className="w-6 h-6" />,
              title: "🎨 Deep Branding Studio",
              desc: "Icon uploader auto-resize ke HDPI/XHDPI/XXHDPI/XXXHDPI/512, splash animator dengan spinner, logo, duration, theme color picker, custom CSS/JS injection",
              grad: "from-violet-600 to-indigo-600",
              img: "/static/logo.png",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "🛡️ Native Permissions",
              desc: "Camera, microphone, geolocation, FileChooser (input file), download manager, hardware back handling, pull-to-refresh, custom user-agent",
              grad: "from-emerald-600 to-teal-600",
              img: "/static/build-engine.png",
            },
            {
              icon: <Bell className="w-6 h-6" />,
              title: "🔔 Push & Monetization",
              desc: "OneSignal / Firebase FCM push, offline custom page editor, AdMob ready, white-label premium, custom keystore signing",
              grad: "from-amber-600 to-orange-600",
              img: "/static/hero-3d.png",
            },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} className="group">
              <Card className="h-full bg-white/[0.04] border-white/10 backdrop-blur-xl hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
                <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${f.grad} p-[1px]`}>
                  <div className="w-full h-full bg-black relative">
                    <img src={f.img} alt="feature" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white border border-white/20">{f.icon}</div>
                  </div>
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-bold text-white text-lg">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="outline" className="text-[10px] border-white/10 text-zinc-400">Real-time Preview</Badge>
                    <Badge className="text-[10px] bg-violet-500/20 text-violet-300 border-violet-500/30">PRO</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Build Pipeline Animated */}
      <section className="relative border-y border-white/10 bg-white/[0.02] backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">How It Works — Vercel + GitHub</Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">Kenapa harus pakai <span className="text-violet-400">GitHub Actions</span> sebagai builder?</h2>
              <p className="text-zinc-400 mb-8">Vercel serverless limit cuma 10-60 detik, gak bisa install Android SDK (butuh 4GB + Gradle 5 menit). Kita pakai pattern async queue paling canggih.</p>
              
              <div className="space-y-4">
                {[
                  { step: "01", t: "Input & Customize di Vercel", d: "URL, icon 512px, warna, splash, permissions — semua live preview", icon: <Globe className="w-4 h-4" /> },
                  { step: "02", t: "Generate TWA Manifest", d: "API bikin Bubblewrap config + Android source JSON + mipmap instructions", icon: <Layers className="w-4 h-4" /> },
                  { step: "03", t: "Trigger GitHub Workflow", d: "workflow_dispatch ke GitHub, runner Ubuntu setup Java 17 + SDK + Gradle", icon: <Zap className="w-4 h-4" /> },
                  { step: "04", t: "Download Signed APK", d: "Artifact + Release, webhook balik ke Vercel, status ready, siap upload Play Store", icon: <Download className="w-4 h-4" /> },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.05] transition">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white shrink-0 relative">
                      {s.icon}
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full text-[10px] flex items-center justify-center font-black">{s.step}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{s.t}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{s.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-[2rem] blur-[40px]" />
              <img src="/static/build-engine.png" alt="build engine" className="relative z-10 w-full rounded-[2rem] border border-white/10 shadow-2xl" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-6 -right-6 z-20 bg-black border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Cpu className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-sm font-bold text-white">Build Success</p>
                    <p className="text-xs text-zinc-400">Gradle • 87 tasks • 2m 34s</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Super */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[2.5rem] border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-indigo-950/50 p-10 md:p-16">
          <div className="absolute inset-0">
            <img src="/static/abstract-mesh.png" alt="mesh" className="w-full h-full object-cover opacity-30" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <motion.img animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} src="/static/logo.png" alt="logo" className="w-20 h-20 mx-auto rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.6)]" />
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Siap jadi Publisher Play Store?</h2>
            <p className="text-zinc-300 text-lg">Gak perlu Android Studio. Gak perlu coding Java. Cukup paste URL, custom icon & warna, klik Build. APK signed siap upload langsung jadi.</p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link href="/builder">
                <Button className="rounded-full h-14 px-10 text-base font-black bg-white text-black hover:bg-zinc-200 gap-2">
                  <Rocket className="w-5 h-5" /> Build APK Pertama Gratis
                </Button>
              </Link>
              <Button variant="outline" className="rounded-full h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2">
                <Github className="w-5 h-5" /> Lihat Source di GitHub
              </Button>
            </div>
            <p className="text-xs text-zinc-500">Gratis 2000 menit build/bulan dari GitHub • No credit card • No watermark di PRO</p>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <img src="/static/logo.png" alt="logo" className="w-6 h-6 rounded-lg" />
            <span>© 2026 KyyToAPK Super v2.0 • Built with Next.js 14 + Bubblewrap + GitHub Actions + Framer Motion</span>
          </div>
          <span className="flex items-center gap-2"><Monitor className="w-3 h-3" /> Optimized for Vercel + Super Animated</span>
        </div>
      </footer>
    </div>
  );
}
