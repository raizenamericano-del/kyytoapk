import { NextRequest, NextResponse } from "next/server";
import { buildStore } from "@/lib/github-actions-trigger";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const buildId = params.id;
  let record = await buildStore.get(buildId);
  if (!record) {
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    if (owner && repo) {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/build-${buildId}`, {
          headers: { Accept: "application/vnd.github.v3+json", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
          cache: "no-store"
        });
        if (res.ok) {
          const release = await res.json();
          const apkAsset = release.assets?.find((a: any) => a.name.includes(".apk"));
          const downloadUrl = apkAsset?.browser_download_url || `https://github.com/${owner}/${repo}/releases/download/build-${buildId}/${release.assets?.[0]?.name}`;
          record = await buildStore.getOrCreate(buildId, { status: "ready", progress: 100, message: "Build completed", downloadUrl, sourceZipUrl: downloadUrl });
          await buildStore.update(buildId, { status: "ready", progress: 100, downloadUrl });
        }
      } catch {}
    }
  }
  if (!record) return NextResponse.json({ error: "Build not found", buildId }, { status: 404 });
  return NextResponse.json(record);
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const buildId = params.id;
  const body = await req.json().catch(() => ({}));
  const { status, progress, message, downloadUrl, sourceZipUrl, logs, error } = body;
  let existing = await buildStore.get(buildId);
  if (!existing) existing = await buildStore.getOrCreate(buildId, { status, progress, message, downloadUrl, sourceZipUrl, error });
  await buildStore.update(buildId, { ...(status && { status }), ...(progress !== undefined && { progress }), ...(message && { message }), ...(downloadUrl && { downloadUrl }), ...(sourceZipUrl && { sourceZipUrl }), ...(error && { error }) });
  if (logs) await buildStore.addLog(buildId, logs);
  return NextResponse.json({ success: true, buildId });
}
