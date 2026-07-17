@AGENTS.md

# Surtia — Contexto para Claude

## Qué es este repo
Landing page de Surtia: agente WhatsApp que automatiza pedidos B2B para distribuidoras de LATAM.
**Solo landing, sin backend.** Deploy automático en Vercel al hacer push a `main`.

- Repo: github.com/infobynodo-hue/surtia
- Live: surtia-alpha.vercel.app
- Dev: `npm run dev` → localhost:3001

## Estructura en 30 segundos

```
src/app/page.tsx          ← TODA la landing (~950 líneas, "use client")
src/app/globals.css       ← reset + animaciones msgIn/typing + clases responsive
src/app/layout.tsx        ← metadata SEO + Google Fonts
src/components/ui/
  radial-orbital-timeline.tsx   ← animación orbital (requestAnimationFrame)
  bento-product-features.tsx    ← bento grid de métricas (6 celdas, CSS classes)
  animated-gradient-background  ← fondo breathing del hero
  section-with-mockup.tsx       ← sección de reportes (no activa, sin imágenes reales)
```

## Reglas críticas

### 1. SOLO inline styles para estilos visuales
Tailwind v4 está instalado pero NO hay variables CSS de shadcn definidas.
`bg-card`, `text-muted-foreground`, `rounded-xl` → NO funcionan visualmente.
**Todo color, borde, fondo y tipografía va en `style={{}}`.**

### 2. Usar siempre el objeto C para colores
```typescript
const C = {
  purple: "#5B2BEF", purpleM: "#8B66F7", purpleT: "#C9B8FF",
  green: "#10CC8C", text: "#1A1140", bg: "#FBFAFF",
  bgCard: "#ffffff", bgCream: "#F4F1FE", border: "#E6E0FA", ...
}
```

### 3. Responsive vía `<style>` tag en page.tsx
Las media queries se inyectan como `<style>` en el JSX (no en globals.css — Tailwind v4 las ignora).
Los inline styles de desktop se mantienen; las media queries usan `!important` para mobile.
Breakpoints: `≤ 900px` (tablet), `≤ 640px` (mobile).

### 4. Fuentes
```
Bricolage Grotesque → headings (fontFamily: "'Bricolage Grotesque',sans-serif")
Hanken Grotesk     → body (default)
Space Grotesk      → logotipo
```

### 5. Componentes externos requieren reescritura
Cualquier componente de shadcn/Magic UI/Aceternity debe convertirse a inline styles antes de usarlo.

### 6. No usar emojis de iPhone en la UI

## Secciones de page.tsx (orden)

1. NAV — sticky, logo + links (hidden mobile) + CTA
2. HERO — AnimatedGradientBackground + grid 2col (texto | phone mockup)
3. CLIENTES — banda con 10 nombres
4. DEMO — tabs Texto/Audio/Imagen + ChatDemo + OrderCard (grid 2col)
5. ORBITAL — dark navy, 2col (cards | RadialOrbitalTimeline)
6. BENTO MÉTRICAS — BentoGridShowcase (6 cells, 3×3)
7. IMPLEMENTACIÓN — 4 pasos grid 4col
8. ERP ORBIT — 2 anillos con ERPs, texto integraciones
9. CTA — final
10. FOOTER

## Deploy

```bash
git add -A && git commit -m "mensaje" && git push origin main
# Vercel detecta el push y despliega automáticamente
```

## Lo que está pendiente (no toques sin preguntarle al usuario)

- Logos reales de ERPs (reemplazar text badges)
- Sección de reportes (SectionWithMockup revertida — sin imágenes reales)
- Backend / agente IA real
