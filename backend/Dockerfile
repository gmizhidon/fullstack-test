FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

RUN npm ci

COPY backend ./backend
COPY shared ./shared

RUN npm run build -w shared && npm run build -w backend


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

RUN npm ci --omit=dev -w backend -w shared

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/shared/dist ./shared/dist

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "backend"]
