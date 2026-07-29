import { create } from "zustand";
import { generatePackageName } from "./utils";

export interface AppConfig {
  // Basic Info
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  url: string;

  // Visual Branding
  primaryColor: string;
  navBarColor: string;
  backgroundColor: string;
  icon: string | null; // base64
  splashConfig: {
    backgroundColor: string;
    logo: string | null;
    showSpinner: boolean;
    spinnerColor: string;
    text: string;
    duration: number;
  };

  // Webview Features
  webview: {
    pullToRefresh: boolean;
    hardwareBackButton: boolean;
    enableJavaScript: boolean;
    enableZoom: boolean;
    enableCookies: boolean;
    enableCache: boolean;
    userAgent: string;
    externalLinks: "in-app" | "browser";
  };

  // Permissions & Native
  permissions: {
    camera: boolean;
    microphone: boolean;
    geolocation: boolean;
    fileUpload: boolean;
    fileDownload: boolean;
    contacts: boolean;
    storage: boolean;
  };

  // Advanced
  advanced: {
    pushNotifications: {
      enabled: boolean;
      provider: "onesignal" | "firebase" | "none";
      appId: string;
    };
    offlinePage: {
      enabled: boolean;
      customHtml: string;
      title: string;
      message: string;
    };
    customCss: string;
    customJs: string;
  };

  // Tier
  tier: "free" | "premium";
}

interface BuilderStore {
  config: AppConfig;
  currentStep: number;
  setStep: (step: number) => void;
  updateConfig: (updater: Partial<AppConfig> | ((prev: AppConfig) => Partial<AppConfig>)) => void;
  updateNested: <K extends keyof AppConfig>(key: K, value: Partial<AppConfig[K]>) => void;
  resetConfig: () => void;
}

const defaultConfig: AppConfig = {
  appName: "My Web App",
  packageName: "com.kyytoapk.mywebapp",
  versionName: "1.0.0",
  versionCode: 1,
  url: "https://example.com",

  primaryColor: "#7C3AED",
  navBarColor: "#111827",
  backgroundColor: "#ffffff",
  icon: null,
  splashConfig: {
    backgroundColor: "#111827",
    logo: null,
    showSpinner: true,
    spinnerColor: "#7C3AED",
    text: "Powered by KyyToAPK",
    duration: 2500,
  },

  webview: {
    pullToRefresh: true,
    hardwareBackButton: true,
    enableJavaScript: true,
    enableZoom: false,
    enableCookies: true,
    enableCache: true,
    userAgent: "Mozilla/5.0 KyyToAPK WebView",
    externalLinks: "browser",
  },

  permissions: {
    camera: false,
    microphone: false,
    geolocation: true,
    fileUpload: true,
    fileDownload: true,
    contacts: false,
    storage: true,
  },

  advanced: {
    pushNotifications: {
      enabled: false,
      provider: "none",
      appId: "",
    },
    offlinePage: {
      enabled: true,
      customHtml: "",
      title: "No Internet",
      message: "Please check your connection and try again.",
    },
    customCss: "",
    customJs: "",
  },

  tier: "free",
};

export const useBuilderStore = create<BuilderStore>((set) => ({
  config: defaultConfig,
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  updateConfig: (updater) =>
    set((state) => {
      const partial = typeof updater === "function" ? updater(state.config) : updater;
      const newConfig = { ...state.config, ...partial };
      
      // Auto-generate package name when appName changes
      if (partial.appName && partial.appName !== state.config.appName) {
        if (!state.config.packageName || state.config.packageName.startsWith("com.kyytoapk.")) {
          newConfig.packageName = generatePackageName(partial.appName);
        }
      }
      
      return { config: newConfig };
    }),
  updateNested: (key, value) =>
    set((state) => ({
      config: {
        ...state.config,
        [key]: {
          ...(state.config[key] as object),
          ...value,
        },
      },
    })),
  resetConfig: () => set({ config: defaultConfig, currentStep: 1 }),
}));

export const BUILD_STEPS = [
  { id: 1, title: "URL & App Info", desc: "Basic setup", icon: "🌐" },
  { id: 2, title: "Design & Branding", desc: "Icon, colors, splash", icon: "🎨" },
  { id: 3, title: "WebView & Features", desc: "Native behavior", icon: "⚙️" },
  { id: 4, title: "Build & Download", desc: "Generate APK", icon: "📦" },
];
