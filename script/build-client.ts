import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

// Client-only build for static hosting (Netlify, Vercel, etc.)
async function buildClient() {
  // Clean dist directory - vite will create dist/public
  await rm("dist", { recursive: true, force: true }).catch(() => {
    // Directory might not exist, that's ok
  });

  console.log("Building client for static hosting...");
  await viteBuild();
  console.log("Client build complete! Output: dist/public");
}

buildClient().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});

