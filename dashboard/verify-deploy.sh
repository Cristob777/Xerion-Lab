#!/bin/bash
# Pre-deployment verification script
# MISPA Dashboard - Xerion Lab

echo "🔍 Verificando preparación para deploy..."
echo ""

# Check Node version
echo "📦 Verificando Node.js..."
node -v
if [ $? -eq 0 ]; then
    echo "✅ Node.js instalado"
else
    echo "❌ Node.js no encontrado"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde /dashboard"
    exit 1
fi

echo "✅ Directorio correcto"

# Check .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "   Crea .env con tus credenciales de Supabase"
else
    echo "✅ Archivo .env presente"
fi

# Verify package.json
echo ""
echo "📋 Verificando package.json..."
if grep -q "next" package.json; then
    echo "✅ Next.js configurado"
fi

# Count files
echo ""
echo "📁 Archivos del proyecto:"
echo "   - Páginas: $(find app -name 'page.tsx' 2>/dev/null | wc -l)"
echo "   - API Routes: $(find app/api -name 'route.ts' 2>/dev/null | wc -l)"
echo "   - Componentes: $(find components -name '*.tsx' 2>/dev/null | wc -l)"

# Check vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json presente"
else
    echo "⚠️  vercel.json no encontrado (opcional)"
fi

echo ""
echo "✅ Proyecto listo para deploy!"
echo ""
echo "🚀 Próximo paso:"
echo "   Opción 1 (Web): https://vercel.com → Import Project"
echo "   Opción 2 (CLI): vercel --prod"
echo ""
