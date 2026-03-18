import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (dev, prod, etc)
  // O terceiro parâmetro '' carrega todas as variáveis, não apenas as com prefixo VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: "/",
    server: {
      // Usa a porta do .env ou 80 como fallback
      port: parseInt(env.PORT) || 80,
      // CRUCIAL: '0.0.0.0' permite que o Easypanel acesse o container
      host: '0.0.0.0', 
    },
    preview: {
      port: parseInt(env.PORT) || 80,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: false,
      // Garante que o build limpe a pasta antes de gerar novos arquivos
      emptyOutDir: true,
    },
  };
});