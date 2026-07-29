import { NextRequest, NextResponse } from "next/server";
import { buildStore } from "@/lib/github-actions-trigger";

export const maxDuration = 30;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const buildId = params.id;
  const fileType = req.nextUrl.searchParams.get("file") || "apk";

  if (!buildId) {
    return NextResponse.json({ error: "Missing build ID" }, { status: 400 });
  }

  const record = await buildStore.get(buildId);

  if (!record) {
    return new NextResponse(
      `
      <html>
        <head><title>Build Not Found (KV)</title></head>
        <body style="background:#0a0a0b;color:white;font-family:monospace;padding:40px;text-align:center">
          <h1>😿 Build Not Found (KV v2.2)</h1>
          <p>Build ID: ${buildId}</p>
          <p>KV Connected: ${!!process.env.KV_REST_API_URL ? "YES" : "NO (fallback memory)"}</p>
          <p>Jika KV belum di-setup, setup di Vercel Dashboard > Storage > Create KV > Connect.</p>
          <p>Coba cek Releases: <a href="https://github.com/${process.env.GITHUB_REPO_OWNER || "raizenamericano-del"}/${process.env.GITHUB_REPO_NAME || "kyytoapk"}/releases/tag/build-${buildId}" style="color:#7C3AED">build-${buildId}</a></p>
          <p><a href="/builder" style="color:#7C3AED">← Back to Builder</a></p>
        </body>
      </html>
      `,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }

  const externalUrl = fileType === "zip" ? record.sourceZipUrl : record.downloadUrl;
  
  if (externalUrl && externalUrl.startsWith("http")) {
    return NextResponse.redirect(externalUrl, 302);
  }

  if (record.status !== "ready") {
    return NextResponse.json(
      {
        error: "Build not ready yet (KV persistent check)",
        status: record.status,
        progress: record.progress,
        message: record.message,
        buildId,
        kv: !!process.env.KV_REST_API_URL,
      },
      { status: 400 }
    );
  }

  if (fileType === "apk") {
    const packageName = record.config?.twaManifest?.packageId || record.config?.config?.packageName || "com.kyytoapk.app";
    const appName = record.config?.twaManifest?.name || record.config?.config?.appName || "MyApp";
    
    const mockContent = `
KyyToAPK v2.2 KV - SUPER MOCK APK
=======================
Build ID: ${buildId}
App Name: ${appName}
Package: ${packageName}
URL: ${record.config?.twaManifest?.startUrl || record.config?.config?.url || "https://example.com"}
Build Time: ${new Date(record.createdAt).toISOString()}
Status: ${record.status}
KV: ${process.env.KV_REST_API_URL ? "Connected persistent" : "Fallback memory"}
Logs:
${record.logs.join("\n")}
Config:
${JSON.stringify(record.config, null, 2)}
`.trim();

    return new NextResponse(mockContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${packageName}-${buildId}-MOCK-KV.apk"`,
        "Content-Length": String(Buffer.byteLength(mockContent)),
        "X-KyyToAPK-Mode": "mock-kv",
        "X-KyyToAPK-BuildId": buildId,
      },
    });
  } else {
    const configJson = JSON.stringify(record.config || record, null, 2);
    const fileName = `${buildId}-source-MOCK-KV.zip`;
    
    return new NextResponse(configJson, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "X-KyyToAPK-Mode": "mock-kv",
        "X-KyyToAPK-BuildId": buildId,
      },
    });
  }
}

export async function POST() {
  return NextResponse.json({ 
    error: "Use GET method",
    usage: "/api/download/{buildId}?file=apk or ?file=zip"
  }, { status: 405 });
}
