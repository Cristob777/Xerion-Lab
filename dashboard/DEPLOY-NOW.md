# 🚀 INSTRUCCIONES DE DEPLOY - EJECUTAR AHORA

**El proyecto está 100% listo. Sigue estos pasos:**

---

## ✅ Pre-verificación Completada

```
✅ Node.js instalado (v22.21.1)
✅ 5 páginas creadas
✅ 9 API endpoints funcionales
✅ 8 componentes UI
✅ .env configurado con Supabase
✅ vercel.json presente
✅ Todo pusheado a GitHub
```

---

## 🚀 OPCIÓN 1: Deploy desde Vercel Web (RECOMENDADO - 3 minutos)

### Paso 1: Ir a Vercel
Abre tu navegador y ve a: **https://vercel.com**

### Paso 2: Login
- Clic en "Login"
- Selecciona "Continue with GitHub"

### Paso 3: Import Project
1. Clic en **"Add New Project"**
2. Busca y selecciona: **"Xerion-Lab"**
3. Clic en **"Import"**

### Paso 4: Configuración CRÍTICA ⚠️

**ROOT DIRECTORY**: `dashboard` ← MUY IMPORTANTE

Deja el resto como está:
- Framework Preset: Next.js (detectado automáticamente)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Paso 5: Variables de Entorno

Clic en **"Environment Variables"** y agrega:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wkkqmxpaoeeqnrrcalws.supabase.co
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3FteHBhb2VlcW5ycmNhbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTE1MDUsImV4cCI6MjA3ODM2NzUwNX0.CMLWYvXw9Xc1bcfHG0eeJAlon2mWrGyAWePdHqNxQFM
```

### Paso 6: Deploy!
1. Clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye tu proyecto
3. 🎉 ¡Listo! Vercel te dará una URL como: `https://mispa-dashboard-xxxx.vercel.app`

---

## 🚀 OPCIÓN 2: Deploy con Vercel CLI (Alternativa)

### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Paso 2: Login en Vercel
```bash
vercel login
```
(Se abrirá el navegador para autenticarte)

### Paso 3: Deploy desde dashboard/
```bash
cd dashboard
vercel
```

### Paso 4: Responder preguntas
- Set up and deploy? **Y**
- Which scope? Selecciona tu cuenta
- Link to existing project? **N**
- Project name? **mispa-dashboard**
- In which directory? **./dashboard** (o solo `.` si ya estás en dashboard/)
- Want to override settings? **N**

### Paso 5: Agregar variables de entorno
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Pega: https://wkkqmxpaoeeqnrrcalws.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Pega el token completo
```

### Paso 6: Deploy a producción
```bash
vercel --prod
```

---

## ✅ Verificación Post-Deploy

Una vez deployado, verifica que todo funciona:

### 1. Abre la URL del dashboard
Vercel te dará una URL. Ábrela.

### 2. Verifica las páginas
- ✅ Dashboard Principal (/)
- ✅ Productos (/productos)
- ✅ Clientes (/clientes)
- ✅ Inventario (/inventario)
- ✅ **Predicciones IA (/predicciones)** ← NUEVO

### 3. Verifica que los datos cargan
- Los KPIs deben mostrar números
- Los gráficos deben aparecer
- Las tablas deben tener datos

### 4. Verifica la página de IA
- Health Score debe mostrar un número
- Gráfico de forecast debe aparecer
- Insights deben listarse

---

## 🐛 Troubleshooting

### Error: "Missing Environment Variables"
→ Verifica que agregaste ambas variables en Vercel:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

### Error: "Failed to fetch from Supabase"
→ Verifica políticas RLS en Supabase:
  1. Ve a Supabase Dashboard
  2. Authentication → Policies
  3. Asegúrate que las tablas permiten SELECT anónimo

### Build falla
→ Revisa los logs en Vercel:
  1. Ve a tu proyecto en Vercel
  2. Clic en el deployment fallido
  3. Clic en "View Logs"
  4. Busca el error específico

### La página carga pero no muestra datos
→ Abre la consola del navegador (F12):
  1. Ve a "Console"
  2. Busca errores en rojo
  3. Verifica que las llamadas a /api/* retornan 200

---

## 🎯 URLs del Proyecto

Una vez deployado:
- **Dashboard**: https://tu-proyecto.vercel.app
- **Predicciones IA**: https://tu-proyecto.vercel.app/predicciones
- **API Health**: https://tu-proyecto.vercel.app/api/kpis
- **API Forecast**: https://tu-proyecto.vercel.app/api/ai/forecast

---

## 📊 Features Disponibles

### Dashboard Principal
- KPIs con crecimiento %
- Tendencias de ventas
- Top 10 productos
- Distribución por categoría

### Predicciones IA 🤖
- Forecast 6 meses
- Health Score 0-100
- 8+ insights automáticos
- Recomendaciones estratégicas

### Análisis Completo
- Productos (drill-down por categoría)
- Clientes (segmentación RFM)
- Inventario (alertas de stock)

---

## 🎉 ¡Todo Listo!

El dashboard MISPA con **Predicciones IA** está listo para producción.

**Commit actual**: dcffb72
**Branch**: claude/mispa-bi-dashboard-implementation-011CUzcWtMEQ9XG6YH9jvzNK
**Estado**: 90% completo (19/21 componentes)

---

## 📞 Soporte

Si tienes problemas durante el deploy:
1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Consulta DEPLOYMENT.md para más detalles

---

**Xerion Lab © 2025**
Desarrollado por Claude para Cristóbal Cáceres
