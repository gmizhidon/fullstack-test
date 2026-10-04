# Fullstack Test Task

Fullstack-приложение для работы со списком из 1 000 000 элементов.

## Возможности

- фильтрация по ID;
- infinite scroll по 20 элементов;
- добавление элементов с уникальным ID;
- выбор и отмена выбора элементов;
- Drag & Drop выбранных элементов;
- сохранение состояния и порядка на сервере;
- виртуализация списков;
- batching и дедупликация запросов.

## Стек

**Frontend:** React, TypeScript, TanStack Query, TanStack Virtual, Zustand, dnd-kit, SCSS Modules.

**Backend:** Node.js, Express, TypeScript, Zod, Vitest.

Проект использует npm workspaces:

```text
frontend/
backend/
shared/
```

Базовый список `1..1_000_000` не хранится в памяти в виде миллиона объектов. Backend хранит только необходимые изменения и выбранные элементы.

Порядок выбранных элементов хранится с помощью двусвязного списка и `Map`, что позволяет эффективно находить и перемещать элементы.

Запросы обрабатываются пакетно: добавление — каждые 10 секунд, получение и изменение данных — каждую 1 секунду.

## Запуск

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Проверка

```bash
npm run build
npm run lint
npm test
```

## Deployment

Проект подготовлен для запуска через Docker Compose:

```bash
docker compose up -d --build
```

Frontend и API доступны через nginx на порту `8080`. Запросы `/api/*` проксируются в backend-контейнер.
