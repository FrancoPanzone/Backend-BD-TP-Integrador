# ---- Etapa 1: Builder ----
FROM node:16-alpine AS builder

WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar TypeScript
COPY . .
RUN npm run build

# ---- Etapa 2: Imagen final para producción ----
FROM node:16-alpine

WORKDIR /app

# Copiar package.json para instalar solo deps de producción
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Copiar el build generado
COPY --from=builder /app/dist ./dist

# Copiar directorio public si existe (archivos estáticos)
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD ["npm", "start"]
