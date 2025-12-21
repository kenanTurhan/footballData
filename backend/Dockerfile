# Stage de build
FROM node:20-alpine AS builder
WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier package.json et lockfile d'abord pour tirer parti du cache Docker
COPY package.json pnpm-lock.yaml* ./

# Installer les dépendances (prod + dev pour build)
RUN pnpm install --frozen-lockfile

# Copier le reste du code
COPY . .

# Builder l'app (adapté à ton script de build)
RUN pnpm run build

# Stage runtime (image légère)
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

# Copier seulement les fichiers nécessaires pour exécuter
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
# si tu as des assets statiques : COPY --from=builder /app/public ./public

ENV NODE_ENV=production
# Port exposé (change si nécessaire)
EXPOSE 3000

# Commande de démarrage (ajuste selon ton package.json)
CMD ["pnpm", "run", "start:prod"]
# ou si tu as script start:prod : CMD ["pnpm", "run", "start:prod"]
