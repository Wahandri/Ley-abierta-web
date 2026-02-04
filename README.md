# Ley Abierta

**Leyes y documentos públicos españoles explicados en lenguaje claro.**

Una aplicación Next.js para entender lo que se ha aprobado: resúmenes ciudadanos, impacto y a quién afecta.

---

## 🎯 Características

- **Lenguaje claro**: Resúmenes ciudadanos de cada documento legal
- **Visualización de impacto**: Indicadores visuales del nivel de importancia (0-100)
- **Filtros inteligentes**: Por tema, impacto, y a quién afecta
- **Búsqueda completa**: Busca en títulos, resúmenes y palabras clave
- **Responsive**: Diseñado para móvil, tablet y desktop
- **Accesible**: Navegación por teclado, HTML semántico, contraste adecuado
- **Sin frameworks CSS**: Estilado con CSS puro y CSS Modules

---

## 🚀 Tecnologías

- **Next.js 16.1.6** (App Router)
- **TypeScript**
- **Pure CSS** (CSS Modules + global styles)
- **Server-Side Rendering** para SEO
- **In-memory cache** para rendimiento

---

## 📂 Estructura del Proyecto

```
ley-abierta-web/
├── src/
│   ├── app/                      # Pages y layouts (App Router)
│   │   ├── api/                  # API Routes
│   │   │   ├── docs/            # Listado y detalle
│   │   │   └── facets/          # Contadores para filtros
│   │   ├── docs/                # Páginas de documentos
│   │   │   ├── [id]/           # Detalle de documento
│   │   │   └── page.tsx        # Listado con filtros
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home
│   │   └── globals.css         # Estilos globales
│   ├── components/              # Componentes UI
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── DocCard.tsx         # Componente clave
│   │   ├── SearchBar.tsx
│   │   ├── FiltersPanel.tsx
│   │   ├── ImpactBadge.tsx
│   │   ├── ImpactBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── lib/                     # Utilidades y lógica de negocio
│   │   ├── jsonl.ts            # Parser JSONL
│   │   ├── documents.ts        # Cache y queries
│   │   └── constants.ts        # Tipos, labels, helpers
│   └── data/
│       └── master_2025.jsonl   # Datos (845+ documentos)
├── package.json
└── next.config.ts
```

---

## 🏃 Ejecución Local

### Instalación

```bash
npm install
```

### Modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de producción

```bash
npm run build
npm start
```

---

## 📖 Uso

### Página de inicio (`/`)
- Hero con llamada a la acción
- Últimos 12 documentos
- Exploración por temas

### Listado de documentos (`/docs`)
- Barra de búsqueda con debounce
- Panel de filtros (tema, impacto, "a quién afecta")
- Grid responsive de tarjetas
- Paginación (20 docs por página)

### Detalle de documento (`/docs/[id]`)
- Título y metadatos
- Nivel de impacto visual
- Resumen ciudadano
- "Lo importante de un vistazo" (cards)
- Notas de transparencia
- Datos oficiales (colapsable)

---

## 🎨 Sistema de diseño

### Colores
- **Primario**: Azul (#2563eb)
- **Impacto Bajo**: Verde (#10b981)
- **Impacto Medio**: Naranja (#f59e0b)
- **Impacto Alto**: Rojo (#ef4444)

### Tipografía
- System fonts (San Francisco, Segoe UI, Roboto, etc.)
- Tamaños responsivos
- Alto contraste para accesibilidad

### Componentes
- CSS Modules para encapsulación
- Variables CSS para consistencia
- Diseño mobile-first

---

## 📊 Datos

### Fuente
Documentos del **BOE (Boletín Oficial del Estado)** procesados en formato JSONL.

### Campos principales
- `title_original`: Título oficial
- `summary_plain_es`: Resumen en lenguaje claro
- `topic_primary`: Tema (economía, vivienda, sanidad, etc.)
- `impact_index.score`: 0-100
- `affects_to`: Array de grupos afectados
- `url_oficial`: Enlace al BOE
- `transparency_notes`: Por qué es importante

### Cache en memoria
- El archivo JSONL se parsea **una sola vez** al inicio
- Los documentos se mantienen en memoria para búsquedas rápidas
- No requiere base de datos

---

## 🚢 Deployment en Vercel

### Opción 1: UI de Vercel
1. Sube el repositorio a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Vercel detectará Next.js automáticamente
4. Deploy

### Opción 2: CLI de Vercel
```bash
npm i -g vercel
vercel
```

---

## ♿ Accesibilidad

- HTML semántico (`<main>`, `<nav>`, `<article>`, etc.)
- Navegación por teclado
- Estados de focus visibles
- Labels ARIA donde es necesario
- Contraste WCAG AA

---

## 🔍 SEO

- Metadata dinámica en páginas
- Server-Side Rendering
- Títulos y descripciones únicas por documento
- URLs semánticas (`/docs/[id]`)

---

## 📝 Licencia

Proyecto educativo. Datos fuente: BOE.

---

## 👤 Autor

Desarrollado como plataforma ciudadana para transparencia y comprensión de documentos públicos.

---

## 🤝 Contribuir

Este proyecto está diseñado para ser extensible. Posibles mejoras:

- Integración con APIs del BOE en tiempo real
- Sistema de notificaciones de nuevas leyes
- Comparador de versiones de documentos
- Comentarios y discusiones ciudadanas
- Traducción a otras lenguas cooficiales
