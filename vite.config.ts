import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isReplit = process.env.REPL_ID !== undefined;
  
  const plugins = [
    react(),
    tailwindcss(),
    metaImagesPlugin(),
  ];

  // Only include Replit-specific plugins in development on Replit
  if (isDevelopment && isReplit) {
    try {
      const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
      plugins.push(runtimeErrorOverlay());
      
      const cartographerPlugin = await import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer()
      );
      plugins.push(cartographerPlugin);
      
      const devBannerPlugin = await import("@replit/vite-plugin-dev-banner").then((m) =>
        m.devBanner()
      );
      plugins.push(devBannerPlugin);
    } catch (error) {
      // Replit plugins not available, continue without them
      console.warn("Replit plugins not available, skipping:", error);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
