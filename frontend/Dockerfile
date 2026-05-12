# ---------- Build (needs devDependencies for tsc + vite) ----------
FROM node:20-alpine AS build

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines these at build time; override in CI: docker build --build-arg VITE_BASE_URL=...
ARG VITE_BASE_URL=https://uks40k0cgks4ow4s4ogcsw4s.snapphoundtests.com/api/v1
ARG VITE_MAIN_URL=
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_MAIN_URL=$VITE_MAIN_URL

RUN npm run build

# ---------- Production: static SPA ----------
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 8080

CMD ["nginx", "-g", "daemon off;"]
