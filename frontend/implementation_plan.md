# Reestructuración de Arquitectura — Forkast Food Planning App

## Contexto y Análisis del Proyecto Actual

El proyecto fue generado desde **Figma → código** usando Vite + React + TypeScript (.tsx). Actualmente:

- **Stack**: Vite 6, React 18, TailwindCSS 4, shadcn/ui (Radix + CVA)
- **13 componentes** en una carpeta plana (`src/app/components/`)
- **48 componentes UI** de shadcn en `src/app/components/ui/`
- **No hay tsconfig.json** (Vite maneja la transpilación sin él)
- **No hay separación** entre páginas, layouts, datos, hooks o utilidades

---

## Consejo: ¿TSX o JSX?

> [!IMPORTANT]
> **Recomendación: Quedarse con TSX (.tsx)**

### ¿Por qué mantener TypeScript?

| Aspecto | TSX (TypeScript) | JSX (JavaScript) |
|---|---|---|
| **Errores en desarrollo** | Los detecta antes de ejecutar | Solo los ves en el navegador |
| **Autocompletado (IntelliSense)** | Excelente, te sugiere props | Limitado |
| **shadcn/ui** | Diseñado para TS, todo tipado | Habría que quitar tipos manualmente |
| **Refactoring** | Seguro, el IDE te avisa | Propenso a romper cosas |
| **Curva extra** | Mínima (ya está configurado) | Ninguna, pero pierdes beneficios |
| **Valor universitario** | Demuestra competencia profesional | Estándar básico |

**En resumen**: El proyecto ya está en TSX, shadcn/ui está diseñado para TS, y el esfuerzo de migrar a JSX sería trabajo innecesario que además **restaría calidad**. TypeScript te va a ahorrar dolores de cabeza detectando errores antes de tiempo — justo lo que necesitas en un proyecto universitario donde el funcionamiento es prioridad.

Lo que sí haré es agregar un `tsconfig.json` apropiado que actualmente no existe.

---

## Propuesta de Arquitectura de Carpetas

### Estructura Actual (Problemática)
```
src/
├── app/
│   ├── App.tsx
│   └── components/           ← TODO mezclado aquí
│       ├── SplashScreen.tsx
│       ├── LoginScreen.tsx
│       ├── WeeklyMenuScreen.tsx
│       ├── BottomNav.tsx
│       ├── Header.tsx
│       ├── Logo.tsx
│       ├── figma/
│       └── ui/               ← 48 componentes shadcn
├── imports/
├── styles/
└── main.tsx
```

**Problemas**: No hay separación de responsabilidades, páginas mezcladas con componentes reutilizables, no hay lugar para datos, hooks, ni utilidades.

### Estructura Propuesta (Limpia y Escalable)

```
src/
├── main.tsx                          ← Entry point (sin cambios)
│
├── app/
│   └── App.tsx                       ← Router principal (sin cambios)
│
├── pages/                            ← Pantallas/Vistas (una por ruta)
│   ├── SplashPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── FoodProfilePage.tsx
│   ├── RecommendationsPage.tsx
│   ├── RecipeDetailPage.tsx
│   ├── WeeklyMenuPage.tsx
│   ├── ShoppingListPage.tsx
│   ├── InventoryPage.tsx
│   └── DashboardPage.tsx
│
├── components/                       ← Componentes reutilizables
│   ├── layout/                       ← Layout y navegación
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── AppLayout.tsx             ← [NEW] Layout compartido (Header + BottomNav)
│   ├── common/                       ← Componentes comunes del proyecto
│   │   └── Logo.tsx
│   ├── figma/                        ← Componentes de Figma
│   │   └── ImageWithFallback.tsx
│   └── ui/                           ← shadcn/ui (sin cambios internos)
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (48 archivos)
│
├── data/                             ← [NEW] Datos mock/estáticos
│   └── mock/
│       ├── menuData.ts               ← Datos del menú semanal
│       ├── inventoryData.ts          ← Datos del inventario
│       ├── shoppingData.ts           ← Datos de lista de compras
│       └── statsData.ts              ← Datos de estadísticas
│
├── hooks/                            ← [NEW] Custom hooks
│   └── .gitkeep                      ← Listo para cuando necesites hooks
│
├── types/                            ← [NEW] Tipos TypeScript compartidos
│   └── index.ts                      ← Tipos como MealData, Recipe, etc.
│
├── lib/                              ← [NEW] Utilidades y funciones helper
│   └── utils.ts                      ← (mover desde ui/utils.ts)
│
├── assets/                           ← [NEW] Imágenes y recursos estáticos
│   └── images/
│       └── (logo, etc.)
│
├── imports/                          ← Recursos importados (Figma)
│   └── image.png
│
└── styles/                           ← Estilos (sin cambios)
    ├── index.css
    ├── fonts.css
    ├── tailwind.css
    └── theme.css
```

---

## Cambios Detallados

### 1. Configuración Base

#### [NEW] [tsconfig.json](file:///home/maria/Documents/PA%20TIC%20I/Forkast%20Food%20Planning%20App/tsconfig.json)
- Agregar configuración TypeScript estándar para Vite + React
- Configurar path alias `@/` para imports limpios

#### [NEW] [tsconfig.app.json](file:///home/maria/Documents/PA%20TIC%20I/Forkast%20Food%20Planning%20App/tsconfig.app.json)
- Configuración específica de la app (exclude node_modules, etc.)

---

### 2. Tipos Compartidos

#### [NEW] src/types/index.ts
- Extraer tipos como `MealData`, `BottomNavProps`, etc.
- Centralizar definiciones de tipos que se usan en múltiples archivos

---

### 3. Datos Mock

#### [NEW] src/data/mock/menuData.ts
- Extraer `menuData`, `daysOfWeek`, `meals` desde WeeklyMenuScreen

#### [NEW] src/data/mock/statsData.ts
- Extraer `monthlySpending` desde DashboardScreen

#### [NEW] src/data/mock/inventoryData.ts
- Extraer datos hardcodeados del inventario

#### [NEW] src/data/mock/shoppingData.ts
- Extraer datos hardcodeados de la lista de compras

---

### 4. Componentes de Layout

#### [NEW] src/components/layout/AppLayout.tsx
- Layout compartido que envuelve Header + contenido + BottomNav
- Evitar repetir el mismo patrón en cada página

#### [MOVE] Header.tsx → src/components/layout/Header.tsx
#### [MOVE] BottomNav.tsx → src/components/layout/BottomNav.tsx

---

### 5. Componentes Comunes

#### [MOVE] Logo.tsx → src/components/common/Logo.tsx
#### [MOVE] ui/ → src/components/ui/ (sin cambios internos)
#### [MOVE] figma/ → src/components/figma/

---

### 6. Páginas

#### [MOVE + RENAME] Cada `*Screen.tsx` → `src/pages/*Page.tsx`
- Renombrar de "Screen" a "Page" (convención más estándar en React)
- Actualizar imports para usar las nuevas rutas
- Extraer datos hardcodeados a `src/data/mock/`
- Usar `AppLayout` donde aplique

---

### 7. Utilidades

#### [MOVE] src/app/components/ui/utils.ts → src/lib/utils.ts
- Mover a ubicación estándar y actualizar imports en todos los archivos ui/

---

### 8. Router (App.tsx)

#### [MODIFY] [App.tsx](file:///home/maria/Documents/PA%20TIC%20I/Forkast%20Food%20Planning%20App/src/app/App.tsx)
- Actualizar todos los imports para apuntar a `src/pages/`

---

## Lo que NO cambia
- Archivos de shadcn/ui (solo se mueven, no se modifican internamente)
- Estilos CSS (permanecen en `src/styles/`)
- Configuración de Vite (solo agregar tsconfig)
- Lógica de cada componente (solo reorganización + extracción de datos)

---

## Plan de Verificación

### Verificación Automática
1. `npm run dev` — Verificar que la app compila sin errores
2. Navegar todas las rutas en el navegador para confirmar funcionamiento

### Verificación Visual
1. Comprobar que la UI se ve exactamente igual que antes
2. Verificar navegación entre pantallas
3. Confirmar que no hay errores en consola

---

## Resumen del Impacto

| Métrica | Antes | Después |
|---|---|---|
| Carpetas en `src/` | 4 | 9 |
| Archivos movidos | — | ~15 |
| Archivos nuevos | — | ~8 (types, data, layout, tsconfig) |
| Archivos modificados | — | ~15 (actualizar imports) |
| Archivos eliminados | — | 0 |
| **Funcionalidad** | **Sin cambios** | **Sin cambios** |
