import { NextRequest, NextResponse } from "next/server";
import { createBuildConfig } from "@/lib/apk-generator";
import { triggerGithubBuild, buildStore } from "@/lib/github-actions-trigger";
import { isValidUrl } from "@/lib/utils";
export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json();
    if (!config?.appName || config.appName.length < 2) return NextResponse.json({ error: "App name is too short" }, { status: 400 });
    if (!config.packageName?.includes(".")) return NextResponse.json({ error: "Invalid package name" }, { status: 400 });
    if (!isValidUrl(config.url)) return NextResponse.json({ error: "Please provide a valid HTTPS URL" }, { status: 400 });
    const buildId = `kyy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const buildConfig = createBuildConfig(config, buildId);
    await buildStore.create(buildId, buildConfig);
    await buildStore.addLog(buildId, `Config validated for ${config.url}`);
    await buildStore.addLog(buildId, `Package: ${config.packageName} v${config.versionName}`);
    const cb = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/status/${buildId}`;
    const result = await triggerGithubBuild({ buildId, configJson: JSON.stringify(buildConfig), callbackUrl: cb });
    if (result.mode === "mock") { await buildStore.simulateProgress(buildId); } else { await buildStore.update(buildId, { status: "validating", progress: 15, message: "Build started - queued in pipeline" }); }
    return NextResponse.json({ success: true, buildId, mode: result.mode, message: result.message });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Build failed" }, { status: 500 }); }
}
export async function GET() { return NextResponse.json({ engine: "KyyToAPK Build Engine", status: "operational" }); }
