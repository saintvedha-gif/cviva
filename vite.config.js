// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En desarrollo local, las Edge Functions corren con `vercel dev`
      // en el puerto 3000. Si no usas `vercel dev`, comenta este bloque
      // y las llamadas a /api fallarán localmente (esperado sin backend local).
      "/api": {
        target: "http://localhost:3000",

        changeOrigin: true,
      },
    },
  },
});