# MISPA Dashboard 2025

Dashboard de Business Intelligence para análisis de ventas, productos, clientes e inventario.

**Desarrollado por**: Xerion Lab
**Cliente**: Cristóbal Cáceres
**Fecha**: Noviembre 2025

---

## 📊 Características

### Dashboard Principal
- ✅ KPIs de ventas totales, transacciones, ticket promedio y clientes activos
- ✅ Comparación con período anterior (crecimiento %)
- ✅ Gráfico de tendencia de ventas mensual
- ✅ Distribución de ventas por categoría (EpicBike vs BlueFishing)
- ✅ Top 10 productos más vendidos
- ✅ Tabla resumen por categoría

### Análisis de Productos
- ✅ Filtro por categoría (EpicBike, BlueFishing)
- ✅ Top 20 productos por ventas
- ✅ Tabla detallada con ventas, cantidad, transacciones y ticket promedio
- ✅ Drill-down interactivo

### Análisis de Clientes
- ✅ Segmentación RFM (Champions, Loyal, At Risk, etc.)
- ✅ Distribución por segmento (gráfico de pastel)
- ✅ Valor total por segmento (gráfico de barras)
- ✅ Tabla de clientes con RFM scores
- ✅ Filtros por segmento

### Análisis de Inventario
- ✅ Alertas de stock (bajo, medio, alto)
- ✅ Días de cobertura por producto
- ✅ Rotación de inventario
- ✅ Estado de stock con colores (rojo, amarillo, verde)
- ✅ Filtros por nivel de stock

### 🤖 Predicciones e Insights con IA (NUEVO)
- ✅ **Forecasting de Ventas** con regresión lineal
  - Predicciones a 6 meses con intervalos de confianza
  - Detección automática de estacionalidad
  - Identificación de tendencias (up/down/stable)
  - Visualización de datos históricos vs predicciones

- ✅ **Agente de Insights Automáticos**
  - Análisis inteligente de métricas clave
  - Detección de oportunidades y alertas
  - Recomendaciones automáticas por categoría
  - Clasificación por impacto (alto, medio, bajo)

- ✅ **Health Score del Negocio**
  - Score de salud 0-100 basado en 5 factores
  - Evaluación automática: Excelente / Bueno / Atención / Crítico
  - Desglose por factor con pesos ponderados
  - Indicadores visuales de rendimiento

- ✅ **Recomendaciones Estratégicas**
  - Sugerencias para productos, clientes e inventario
  - Basadas en análisis de datos en tiempo real
  - Priorización por impacto potencial

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **Gráficos**: Recharts
- **Base de Datos**: Supabase (PostgreSQL)
- **Lenguaje**: TypeScript
- **Deployment**: Vercel

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ instalado
- Cuenta de Supabase con base de datos configurada
- Credenciales de Supabase (URL + Anon Key)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Cristob777/Xerion-Lab.git
cd Xerion-Lab/dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`

5. **Compilar para producción**
```bash
npm run build
npm start
```

---

## 🗄️ Estructura de la Base de Datos

El dashboard consume datos de las siguientes vistas/tablas en Supabase:

### Tablas Principales

#### `fact_ventas_validas` (Vista)
Vista filtrada con todas las ventas que tienen `product_id` válido.

**Columnas clave**:
- `venta_id`, `fecha_venta`, `anio`, `mes`, `trimestre`
- `client_id`, `nombre_cliente`
- `product_id`, `variant_id`, `nombre_producto`, `marca`
- `categoria_nivel1`, `categoria_nivel2`, `categoria_nivel3`
- `cantidad`, `precio_unitario`, `venta_neta`, `venta_bruta`
- `office_id`, `nombre_oficina`

#### `dim_productos`
Dimensión de productos con categorización completa.

**Columnas clave**:
- `product_id`, `variant_id`, `nombre_producto`, `marca`
- `categoria_nivel1` (EpicBike / BlueFishing)
- `categoria_nivel2`, `categoria_nivel3`
- `total_ventas`, `cantidad_vendida`, `numero_transacciones`
- `stock_actual`, `rotacion_stock`, `dias_cobertura`

#### `dim_clientes`
Dimensión de clientes con segmentación RFM.

**Columnas clave**:
- `client_id`, `nombre`, `rut`, `email`
- `segmento_rfm` (Champions, Loyal, At Risk, etc.)
- `score_recency`, `score_frequency`, `score_monetary`
- `total_compras`, `cantidad_ordenes`, `ticket_promedio`
- `clv_estimado`, `dias_desde_ultima_compra`

#### `segmentacion_rfm` (Opcional)
Tabla específica de segmentación RFM con métricas detalladas.

#### `metricas_rotacion_stock` (Opcional)
Métricas de rotación de inventario.

**Columnas clave**:
- `variant_id`, `nombre_producto`, `categoria`
- `stock_actual`, `ventas_30d`
- `rotacion_mensual`, `dias_cobertura`
- `estado_stock`

---

## 🔌 API Endpoints

El dashboard expone las siguientes APIs:

### KPIs Generales
```
GET /api/kpis?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

Retorna: ventas totales, transacciones, ticket promedio, clientes activos, crecimiento %

### Ventas por Categoría
```
GET /api/ventas/categorias?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

Retorna: ventas por categoría (EpicBike, BlueFishing)

### Tendencias de Ventas
```
GET /api/ventas/tendencias?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&groupBy=month
```

Parámetros:
- `groupBy`: `day`, `week`, `month`

### Top Productos
```
GET /api/productos/top?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&limit=10
```

### Segmentación de Clientes
```
GET /api/clientes/segmentacion
```

### Rotación de Stock
```
GET /api/stock/rotacion
```

### 🤖 Predicciones con IA (NUEVO)
```
GET /api/ai/forecast?periods=6&method=linear
```

Parámetros:
- `periods`: Número de períodos a predecir (default: 6)
- `method`: `linear` o `moving_average`

Retorna: Predicciones de ventas con intervalos de confianza + análisis de estacionalidad

### Insights Automáticos (NUEVO)
```
GET /api/ai/insights?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

Retorna: Insights generados por IA, oportunidades, alertas y recomendaciones

### Health Score del Negocio (NUEVO)
```
GET /api/ai/health-score?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
```

Retorna: Score de salud 0-100 con desglose por factores

---

## 📂 Estructura del Proyecto

```
dashboard/
├── app/
│   ├── api/
│   │   ├── kpis/route.ts
│   │   ├── ventas/
│   │   │   ├── categorias/route.ts
│   │   │   └── tendencias/route.ts
│   │   ├── productos/
│   │   │   └── top/route.ts
│   │   ├── clientes/
│   │   │   └── segmentacion/route.ts
│   │   └── stock/
│   │       └── rotacion/route.ts
│   ├── productos/page.tsx
│   ├── clientes/page.tsx
│   ├── inventario/page.tsx
│   ├── page.tsx (Dashboard principal)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ChartWrapper.tsx
│   ├── DashboardLayout.tsx
│   ├── DateFilter.tsx
│   ├── ErrorMessage.tsx
│   ├── Header.tsx
│   ├── KPICard.tsx
│   ├── LoadingSpinner.tsx
│   └── Sidebar.tsx
├── lib/
│   └── supabase.ts
├── types/
│   └── database.types.ts
├── public/
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Deployment en Vercel

### Opción 1: Deploy desde GitHub

1. Hacer push del código a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Conectar repositorio
4. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `dashboard`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Agregar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy

### Opción 2: Deploy con Vercel CLI

```bash
cd dashboard
npm install -g vercel
vercel
```

Seguir las instrucciones y agregar las variables de entorno cuando se soliciten.

---

## 📊 Datos Actuales

Según el reporte del proyecto:

- **Ventas válidas**: 1,407 transacciones (7.6% coverage)
- **Revenue**: $353M CLP
- **Período**: 2020-2021
- **Productos**: 654 registros con categorización 100% completa
- **Clientes**: 303 registros con segmentación RFM
- **Categorías**: EpicBike (bicicletas) y BlueFishing (pesca)

### Próximos Pasos (según roadmap)

1. **Resolver orphan IDs** (2-3 horas)
   - Extracción atómica desde Bronze Layer
   - Coverage: 7.6% → 95%+
   - Revenue: $353M → $1,125M CLP

2. **Actualizar datos 2023-2025** (1 hora)
   - Extracción completa de datos frescos
   - ~30,000 registros nuevos

3. **Optimización** (2 horas)
   - Índices en FKs y fechas
   - Vistas materializadas
   - Query optimization

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verificar que `.env` existe y contiene las credenciales correctas
- Reiniciar el servidor de desarrollo

### Error: "Failed to fetch..."
- Verificar que Supabase está accesible
- Verificar que las tablas/vistas existen en la base de datos
- Revisar políticas RLS (Row Level Security) en Supabase

### Gráficos no se muestran
- Verificar que hay datos en el rango de fechas seleccionado
- Abrir consola del navegador para ver errores

### Performance lento
- Considerar agregar índices en la base de datos
- Implementar paginación en tablas grandes
- Usar vistas materializadas

---

## 📝 Notas Técnicas

### Arquitectura Medallion

El proyecto sigue arquitectura Medallion (Bronze → Silver → Gold):

- **Bronze**: Datos raw inmutables (append-only)
- **Silver**: Datos limpios y normalizados
- **Gold**: Datos analíticos (dimensiones + hechos)

El dashboard consume datos de la capa **Gold**.

### Categorización de Productos

- **EpicBike**: Bicicletas, componentes, accesorios
  - Bicicletas: MTB, Carretera, E-Bike, Gravel
  - Componentes: Transmisión, frenos, ruedas
  - Accesorios: Cascos, ropa, herramientas

- **BlueFishing**: Pesca deportiva
  - Señuelos: Soft Baits, Crankbaits
  - Cañas: Casting, Spinning
  - Carretes, líneas, accesorios

### Segmentación RFM

- **Champions**: Mejores clientes (RFM 4-5, 4-5, 4-5)
- **Loyal Customers**: Clientes leales
- **Potential Loyalist**: Potencial de ser leales
- **Recent Customers**: Clientes nuevos
- **At Risk**: En riesgo de perderse
- **Lost**: Clientes perdidos

---

## 📞 Contacto

**Xerion Lab**
Email: contact@xerionlab.eu
Cliente: Cristóbal Cáceres

---

## 📄 Licencia

© 2025 Xerion Lab - Todos los derechos reservados
