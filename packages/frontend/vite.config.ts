import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/receive-tabs": {
        target: "http://localhost:5173",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              const { urls } = JSON.parse(body);
              globalThis.tabLinks = urls;
              res.end(JSON.stringify({ success: true }));
            });
          });
        },
      },
    },
  },
});
