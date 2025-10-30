FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM nginx:mainline-alpine-slim AS runner

COPY --from=builder /app/dist/ /usr/share/nginx/html