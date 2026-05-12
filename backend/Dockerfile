# ---------- 1️⃣ Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# node images set NODE_ENV=production, which makes `npm ci` skip devDependencies.
# TypeScript lives in devDependencies, so we must install it for this stage.
ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]