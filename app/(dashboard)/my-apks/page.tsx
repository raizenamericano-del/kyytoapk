"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Package, Globe, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SavedApk {
  id: string;
  appName: string;
  packageName: string;
  url: string;
  icon: string | null;
  createdAt: number;
  status: string;
}

export default function MyApksPage() {
  const [apks, setApks] = useState<SavedApk[]>([]);
  const [filter, setFilter] = useState<"all" | "ready" | "building">("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("kyy_apks") || "[]");
    setApks(stored);
  }, []);

  const deleteApk = (id: string) => {
    const filtered = apks.filter((a) => a.id !== id);
    setApks(filtered);
    localStorage.setItem("kyy_apks", JSON.stringify(filtered));
  };

  const clearAll = () => {
    if (confirm("Hapus semua history? (tidak menghapus file APK di GitHub)")) {
      setApks([]);
      localStorage.removeItem("kyy_apks");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">My APKs History</h1>
          <p className="text-sm text-zinc-400">Kelola & re-download APK yang pernah kamu build. Data disimpan local di browser (upgrade ke Supabase untuk cloud sync)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll} className="rounded-full bg-white/5 border-white/10 gap-2">
            <Trash2 className="w-4 h-4" /> Clear All
          </Button>
          <Link href="/builder">
            <Button variant="gradient" size="sm" className="rounded-full">Build New APK</Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { id: "all", label: "All Builds" },
          { id: "ready", label: "Ready" },
          { id: "building", label: "Building" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              filter === f.id ? "bg-violet-600 border-violet-500 text-white" : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {apks.length === 0 ? (
        <Card className="bg-zinc-900 border-white/10 border-dashed">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Package className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="font-semibold text-white">Belum ada APK</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">Build pertama kamu akan muncul disini. History disimpan local di browser, jadi gak hilang kalau belum clear cache.</p>
            <Link href="/builder">
              <Button variant="gradient" className="rounded-full mt-4">Start Building</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apks.map((apk) => (
            <Card key={apk.id} className="bg-zinc-900 border-white/10 hover:border-violet-500/30 hover:bg-zinc-900/80 transition group">
              <CardContent className="p-5 space-y-4">
                <div className="flex gap-3">
                  {apk.icon ? (
                    <img src={apk.icon} alt="icon" className="w-12 h-12 rounded-xl object-cover bg-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {apk.appName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{apk.appName}</h4>
                    <p className="text-[11px] font-mono text-zinc-400 truncate">{apk.packageName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant={apk.status === "ready" ? "success" : "secondary"} className="text-[10px] gap-1">
                        {apk.status === "ready" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {apk.status}
                      </Badge>
                      <span className="text-[10px] text-zinc-500">{new Date(apk.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 p-2 rounded-lg bg-black/30">
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="truncate">{apk.url}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="gradient" className="flex-1 rounded-xl gap-1 h-9">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl bg-white/5 border-white/10 h-9" onClick={() => deleteApk(apk.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-[10px] font-mono text-zinc-600 truncate">ID: {apk.id}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-br from-violet-950/30 to-indigo-950/30 border-violet-500/20">
        <CardContent className="p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-violet-400 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Upgrade ke Supabase untuk Cloud History</h4>
            <p className="text-xs text-zinc-400">Saat ini history hanya localStorage. Di production, integrasikan Supabase/Prisma PostgreSQL untuk save build, user auth via NextAuth/Clerk, dan download link permanen dari GitHub Releases / S3.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
