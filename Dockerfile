# =========================
# 🔧 Build do projeto (Vite)
# =========================
FROM node:20-alpine as build

WORKDIR /app

# Copia apenas dependências primeiro (melhora cache)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto do projeto
COPY . .

# Gera build de produção
RUN npm run build


# =========================
# 🚀 Servir com Nginx (leve e rápido)
# =========================
FROM nginx:alpine

# Remove config padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe porta padrão
EXPOSE 3005

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]