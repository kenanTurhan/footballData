FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .

# On ne build pas encore, on fait du dev server directement
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
