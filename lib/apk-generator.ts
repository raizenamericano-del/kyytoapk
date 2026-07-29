import { AppConfig } from "./store";

/**
 * KyyToAPK APK Generator Core
 * Generates TWA Manifest + Bubblewrap Config + Android WebView Project Metadata
 * This runs on Next.js API (Edge compatible)
 */

export interface TwaManifest {
  packageId: string;
  host: string;
  name: string;
  launcherName: string;
  display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  themeColor: string;
  navigationColor: string;
  backgroundColor: string;
  enableNotifications: boolean;
  startUrl: string;
  iconUrl: string;
  maskableIconUrl?: string;
  splashScreenFadeOutDuration: number;
  signingKey: {
    path: string;
    alias: string;
  };
  appVersion: string;
  appVersionCode: number;
  shortcuts: Array<{ name: string; shortName: string; url: string; iconUrl: string }>;
  generatorApp: string;
  webManifestUrl: string;
  fallbackType: "customtabs" | "webview";
  features: {
    locationDelegation: { enabled: boolean };
    playBilling?: { enabled: boolean };
  };
  alphaDependencies: { enabled: boolean };
  enableSiteSettingsShortcut: { enabled: boolean };
  isChromeOSOnly: boolean;
  isMetaQuest: boolean;
  fullScopeUrl: string;
  minSdkVersion: number;
  orientation: "default" | "portrait" | "landscape" | "any";
}

export interface BuildConfig {
  id: string;
  timestamp: number;
  config: AppConfig;
  twaManifest: TwaManifest;
  androidConfig: {
    minSdk: number;
    targetSdk: number;
    compileSdk: number;
    permissions: string[];
    usesFeatures: string[];
  };
  assets: {
    iconBase64?: string | null;
    splashLogoBase64?: string | null;
  };
}

export function generateTwaManifest(appConfig: AppConfig): TwaManifest {
  const urlObj = new URL(appConfig.url);
  const host = urlObj.hostname;

  return {
    packageId: appConfig.packageName,
    host: host,
    name: appConfig.appName,
    launcherName: appConfig.appName,
    display: "standalone",
    themeColor: appConfig.primaryColor,
    navigationColor: appConfig.navBarColor,
    backgroundColor: appConfig.backgroundColor,
    enableNotifications: appConfig.advanced.pushNotifications.enabled,
    startUrl: appConfig.url,
    iconUrl: "/icon-512x512.png", // will be replaced by actual asset
    maskableIconUrl: "/icon-512x512-maskable.png",
    splashScreenFadeOutDuration: appConfig.splashConfig.duration,
    signingKey: {
      path: "./android.keystore",
      alias: "android",
    },
    appVersion: appConfig.versionName,
    appVersionCode: appConfig.versionCode,
    shortcuts: [],
    generatorApp: "kyytoapk",
    webManifestUrl: `${appConfig.url.replace(/\/$/, "")}/manifest.json`,
    fallbackType: appConfig.webview.externalLinks === "browser" ? "customtabs" : "webview",
    features: {
      locationDelegation: { enabled: appConfig.permissions.geolocation },
    },
    alphaDependencies: { enabled: false },
    enableSiteSettingsShortcut: { enabled: true },
    isChromeOSOnly: false,
    isMetaQuest: false,
    fullScopeUrl: `${urlObj.origin}/`,
    minSdkVersion: 21,
    orientation: "default",
  };
}

export function generateAndroidConfig(appConfig: AppConfig) {
  const permissions: string[] = [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
  ];

  const usesFeatures: string[] = [];

  if (appConfig.permissions.camera) {
    permissions.push("android.permission.CAMERA");
    usesFeatures.push("android.hardware.camera");
  }
  if (appConfig.permissions.microphone) {
    permissions.push("android.permission.RECORD_AUDIO");
    permissions.push("android.permission.MODIFY_AUDIO_SETTINGS");
  }
  if (appConfig.permissions.geolocation) {
    permissions.push("android.permission.ACCESS_FINE_LOCATION");
    permissions.push("android.permission.ACCESS_COARSE_LOCATION");
  }
  if (appConfig.permissions.storage || appConfig.permissions.fileDownload) {
    permissions.push("android.permission.WRITE_EXTERNAL_STORAGE");
    permissions.push("android.permission.READ_EXTERNAL_STORAGE");
  }
  if (appConfig.permissions.contacts) {
    permissions.push("android.permission.READ_CONTACTS");
  }
  if (appConfig.webview.pullToRefresh) {
    // no extra permission
  }

  return {
    minSdk: 21,
    targetSdk: 34,
    compileSdk: 34,
    permissions,
    usesFeatures,
  };
}

export function createBuildConfig(appConfig: AppConfig, buildId: string): BuildConfig {
  return {
    id: buildId,
    timestamp: Date.now(),
    config: appConfig,
    twaManifest: generateTwaManifest(appConfig),
    androidConfig: generateAndroidConfig(appConfig),
    assets: {
      iconBase64: appConfig.icon,
      splashLogoBase64: appConfig.splashConfig.logo,
    },
  };
}

// Icon resizing manifest for Android mipmap generation (for GitHub Actions)
export function generateMipmapInstructions() {
  return [
    { folder: "mipmap-hdpi", size: 72 },
    { folder: "mipmap-mdpi", size: 48 },
    { folder: "mipmap-xhdpi", size: 96 },
    { folder: "mipmap-xxhdpi", size: 144 },
    { folder: "mipmap-xxxhdpi", size: 192 },
    { folder: "drawable", size: 512, name: "icon-512.png" },
  ];
}
