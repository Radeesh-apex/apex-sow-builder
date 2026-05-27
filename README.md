# SOW Builder UI

A dedicated, high-performance web interface designed to streamline the creation, formatting, and generation of Statements of Work (SOW). Built using **React**, **Vite**, and **TypeScript** for a lightning-fast development experience and optimized user workflows.

---

## Project Structure

```
sow-builder-ui/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   └── layout/          # AppLayout, AppHeader, AppSidebar
    ├── modules/             # Feature modules (pages)
    │   ├── home/
    │   ├── services/
    │   ├── contact/
    │   └── errors/
    ├── shared/              # Cross-cutting concerns
    │   ├── services/        # apiClient (Axios)
    │   ├── utils/           # dateUtils, formatUtils
    │   └── hooks/           # useApiCall, useLocalStorage
    ├── routes/              # AppRoutes, PATHS constants
    └── theme/               # Light/dark MuiThemeProvider
```

---

## Quick Start

```bash
cd sow-builder-ui
npm install
npm run dev
```

Runs at **http://localhost:5173** (or next available port).

---

## After Changing `apex-ui-components`

The alias in `vite.config.ts` points directly to `../../apex-ui-components/src`. Vite HMR reloads changes instantly — no rebuild needed.

---

## Adding a New Module

1. Create `src/modules/<feature>/MyPage.tsx` + `index.ts`
2. Add the path to `src/routes/routePaths.ts`
3. Add a lazy `<Route>` in `src/routes/AppRoutes.tsx`
4. Add a nav entry in `src/components/layout/AppSidebar.tsx`

---

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=https://api.yourservice.com
```

The `apiClient` in `shared/services/apiClient.ts` reads `VITE_API_BASE_URL` automatically.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
