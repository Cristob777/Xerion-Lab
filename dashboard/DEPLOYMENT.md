# 🚀 Instrucciones de Deployment a Vercel

## Opción 1: Deploy desde GitHub (RECOMENDADO - Más fácil)

### Paso 1: Ir a Vercel
1. Abre https://vercel.com
2. Haz clic en "Sign Up" o "Log In"
3. Conecta tu cuenta de GitHub

### Paso 2: Importar Proyecto
1. En el dashboard de Vercel, clic en "Add New Project"
2. Selecciona el repositorio: `Xerion-Lab`
3. Configura:
   - **Framework Preset**: Next.js
   - **Root Directory**: `dashboard` ⚠️ MUY IMPORTANTE
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Paso 3: Variables de Entorno
En la sección "Environment Variables", agrega:

```
NEXT_PUBLIC_SUPABASE_URL = https://wkkqmxpaoeeqnrrcalws.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3FteHBhb2VlcW5ycmNhbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTE1MDUsImV4cCI6MjA3ODM2NzUwNX0.CMLWYvXw9Xc1bcfHG0eeJAlon2mWrGyAWePdHqNxQFM
```

### Paso 4: Deploy
1. Haz clic en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye tu app
3. ¡Listo! Tendrás una URL como: `https://xerion-lab-xxxx.vercel.app`

---

## Opción 2: Deploy con Vercel CLI

### Requisitos
- Node.js instalado
- Terminal / Command Prompt

### Pasos

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Login en Vercel**
```bash
vercel login
```
(Se abrirá el navegador para autenticarte)

3. **Deploy desde el directorio dashboard**
```bash
cd dashboard
vercel
```

4. **Responde las preguntas**:
- Set up and deploy? **Y**
- Which scope? Selecciona tu cuenta
- Link to existing project? **N**
- Project name? `mispa-dashboard` (o el que prefieras)
- In which directory? **./dashboard** (o solo `.` si ya estás en dashboard/)
- Want to override settings? **N**

5. **Agregar variables de entorno**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Pega: https://wkkqmxpaoeeqnrrcalws.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Pega: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3FteHBhb2VlcW5ycmNhbHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTE1MDUsImV4cCI6MjA3ODM2NzUwNX0.CMLWYvXw9Xc1bcfHG0eeJAlon2mWrGyAWePdHqNxQFM
```

6. **Deploy a producción**
```bash
vercel --prod
```

---

## ✅ Verificar que funciona

Una vez deployado, abre la URL que te dio Vercel (ej: https://mispa-dashboard.vercel.app)

Deberías ver:
- ✅ Dashboard con sidebar de navegación
- ✅ KPIs mostrando datos reales
- ✅ Gráficos con datos de Supabase
- ✅ 4 páginas funcionando: Dashboard, Productos, Clientes, Inventario

---

## 🔧 Troubleshooting

### Error: "Missing Environment Variables"
- Verifica que agregaste las variables en Vercel
- Asegúrate que los nombres son EXACTOS (distinguen mayúsculas)

### Error: "Failed to fetch"
- Verifica que las credenciales de Supabase son correctas
- Revisa que las tablas existen en Supabase: `fact_ventas_validas`, `dim_productos`, `dim_clientes`

### Error: "Build Failed"
- Verifica que el "Root Directory" es `dashboard`
- Asegúrate que todas las dependencias están en package.json

### La página carga pero no muestra datos
- Abre la consola del navegador (F12)
- Revisa si hay errores de API
- Verifica las políticas RLS (Row Level Security) en Supabase

---

## 📊 Después del Deploy

### Configurar Dominio Personalizado (Opcional)
1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio (ej: dashboard.mispa.cl)
4. Sigue las instrucciones para configurar DNS

### Habilitar Analytics (Opcional)
1. En Vercel, ve a Analytics
2. Activa Vercel Analytics
3. Tendrás estadísticas de uso del dashboard

### Auto-deploy en cada push
Vercel automáticamente hace deploy cuando haces push a GitHub:
- Push a `main` → Deploy a producción
- Push a otras ramas → Deploy preview

---

## 🎉 ¡Listo!

Tu dashboard MISPA ya está en producción y accesible desde cualquier lugar.

**URL de producción**: (Se te proporcionará después del deploy)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel (pestaña "Deployments" → clic en el deploy → "View Logs")
2. Revisa la documentación: https://vercel.com/docs
3. Contacta: contact@xerionlab.eu
