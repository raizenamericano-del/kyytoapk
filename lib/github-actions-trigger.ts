export interface TriggerBuildPayload { buildId: string; configJson: string; callbackUrl?: string; }
export async function triggerGithubBuild(payload: TriggerBuildPayload) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const workflowId = process.env.GITHUB_WORKFLOW_ID || "build-apk.yml";
  if (!token || !owner || !repo) {
    return { success: true, mode: "mock" as const, message: "Build queued in demo mode" };
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
      body: JSON.stringify({ ref: "main", inputs: { build_id: payload.buildId, config_json: payload.configJson, callback_url: payload.callbackUrl || "" } }),
    });
    if (!res.ok) throw new Error(await res.text());
    return { success: true, mode: "github" as const, message: "Build pipeline started" };
  } catch (e) {
    return { success: false, mode: "error" as const, message: e instanceof Error ? e.message : "error" };
  }
}
export type BuildStatus = "queued" | "validating" | "injecting" | "compiling" | "signing" | "ready" | "failed";
export interface BuildRecord { id: string; status: BuildStatus; progress: number; message: string; logs: string[]; config?: any; downloadUrl?: string; sourceZipUrl?: string; error?: string; createdAt: number; updatedAt: number; }
const isRedis = () => !!(process.env.KV_REST_API_URL || process.env.KV_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || process.env.STORAGE_URL || process.env.STORAGE_UPSTASH_REDIS_REST_URL);
const globalForBuilds = globalThis as unknown as { __kyyBuilds?: Map<string, BuildRecord>; };
if (!globalForBuilds.__kyyBuilds) globalForBuilds.__kyyBuilds = new Map();
export const buildStore = {
  async create(id: string, config: any): Promise<BuildRecord> {
    const record: BuildRecord = { id, status: "queued", progress: 5, message: "Build queued", logs: [`Build ${id} queued`], config, createdAt: Date.now(), updatedAt: Date.now() };
    if (isRedis()) { try { const { kv } = await import("@vercel/kv"); await kv.set(`build:${id}`, record, { ex: 604800 }); } catch { globalForBuilds.__kyyBuilds!.set(id, record); } } else { globalForBuilds.__kyyBuilds!.set(id, record); }
    return record;
  },
  async get(id: string): Promise<BuildRecord | undefined> {
    if (isRedis()) { try { const { kv } = await import("@vercel/kv"); const r = await kv.get<BuildRecord>(`build:${id}`); if (r) return r; } catch {} }
    return globalForBuilds.__kyyBuilds!.get(id);
  },
  async getOrCreate(id: string, partial?: Partial<BuildRecord>): Promise<BuildRecord> {
    let ex = await this.get(id);
    if (!ex) {
      ex = { id, status: partial?.status || "compiling", progress: partial?.progress || 50, message: partial?.message || "Build in progress", logs: [`Recovered ${id}`], createdAt: Date.now(), updatedAt: Date.now(), ...partial } as BuildRecord;
      if (isRedis()) { try { const { kv } = await import("@vercel/kv"); await kv.set(`build:${id}`, ex, { ex: 604800 }); } catch { globalForBuilds.__kyyBuilds!.set(id, ex); } } else { globalForBuilds.__kyyBuilds!.set(id, ex); }
    }
    return ex;
  },
  async update(id: string, updates: Partial<BuildRecord>) {
    const ex = await this.get(id) || await this.getOrCreate(id, updates);
    if (ex) {
      const up = { ...ex, ...updates, updatedAt: Date.now() };
      if (isRedis()) { try { const { kv } = await import("@vercel/kv"); await kv.set(`build:${id}`, up, { ex: 604800 }); return up; } catch {} }
      globalForBuilds.__kyyBuilds!.set(id, up); return up;
    }
  },
  async addLog(id: string, log: string) {
    const ex = await this.get(id) || await this.getOrCreate(id);
    if (ex) {
      ex.logs.push(`${log}`); ex.updatedAt = Date.now();
      if (isRedis()) { try { const { kv } = await import("@vercel/kv"); await kv.set(`build:${id}`, ex, { ex: 604800 }); } catch { globalForBuilds.__kyyBuilds!.set(id, ex); } } else { globalForBuilds.__kyyBuilds!.set(id, ex); }
    }
  },
  async simulateProgress(id: string) {
    const steps = [
      { status: "validating" as BuildStatus, progress: 15, message: "Validating URL and configuration", delay: 1500 },
      { status: "injecting" as BuildStatus, progress: 35, message: "Preparing icons and assets", delay: 2000 },
      { status: "compiling" as BuildStatus, progress: 65, message: "Compiling APK with Gradle", delay: 3000 },
      { status: "signing" as BuildStatus, progress: 85, message: "Signing and optimizing APK", delay: 1500 },
      { status: "ready" as BuildStatus, progress: 100, message: "Build completed - ready to download", delay: 500 },
    ];
    let cur = 0;
    const run = async () => {
      if (cur >= steps.length) return;
      const s = steps[cur];
      setTimeout(async () => {
        const r = await this.get(id); if (!r || r.status === "failed" || (r.status === "ready" && r.downloadUrl?.startsWith("http"))) return;
        await this.update(id, { status: s.status, progress: s.progress, message: s.message }); await this.addLog(id, s.message);
        if (s.status === "ready") { const ex = await this.get(id); if (!ex?.downloadUrl?.startsWith("http")) await this.update(id, { downloadUrl: `/api/download/${id}?file=apk`, sourceZipUrl: `/api/download/${id}?file=zip` }); }
        cur++; run();
      }, s.delay);
    }; run();
  }
};
