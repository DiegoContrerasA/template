# Estilos: solo Tailwind

Este proyecto usa **Tailwind CSS v4** (`src/index.css`, `@theme inline`) + shadcn/Base UI como base de componentes. No hay, y no se agrega, ningún otro sistema de estilos.

## Reglas

- Toda clase de estilo va en `className` con utilidades de Tailwind. No CSS Modules (`*.module.css`), no styled-components/emotion, no `<style>` embebido, no archivos `.css`/`.scss` nuevos por componente.
- `style={{ ... }}` **solo** para un valor verdaderamente dinámico calculado en runtime que no se puede expresar como clase (ej. un `transform` basado en una posición de drag calculada en JS). Si el valor es conocido en build time, es una clase de Tailwind, no un `style`.
- Combiná/condicioná clases con `cn()` de `@/shared/lib/utils` (`export { cn } from "cn"`), nunca concatenación de strings ni template literals para armar `className`.
- Reusá los tokens ya definidos en `src/index.css` (`--color-*` de shadcn, `--radius-*`) vía las clases que ya existen (`bg-background`, `text-muted-foreground`, `border-border`, `rounded-lg`, etc.). No hardcodees un hex/rgb/px que ya tiene un token equivalente.
- Si un valor no tiene token (un layout puntual, un gap raro), usá un valor arbitrario de Tailwind (`w-[58px]`, `top-[64px]`) antes que salir de Tailwind.

## Variantes de estilo → `cva`

Cuando un componente tiene más de un estado visual (variant, size, disabled...), las clases van en un `cva()` exportado desde un `styles.ts` co-ubicado con el componente — mismo patrón que `buttonVariants` en `shared/components/ui/button.tsx`:

```ts
export const badge = cva("w-full", {
  variants: {
    variant: { default: "...", plain: "" },
  },
  defaultVariants: { variant: "default" },
})
```

No armes el equivalente a mano con ternarios anidados dentro del JSX cuando ya hay 2+ variantes — es exactamente lo que `cva` resuelve.

## Primitivas: componé antes de crear

Antes de escribir un botón/input/modal/select desde cero, revisá
`shared/components/ui/*` — primitivas shadcn/Base UI ya instaladas (`Button`, `Dialog`, `Select`, `Input`, `Field`, `Popover`, `Accordion`, ...).

Si necesitás una primitiva de shadcn que todavía no está instalada, usá la skill `shadcn` de este repo (`npx shadcn add ...`) en vez de reimplementarla a mano. Una primitiva nueva de verdad (no específica de un caso de uso) se agrega en `shared/components/ui/`, nunca dentro de una feature/widget/page.

## Dark mode y responsive

- Dark mode con el variant `dark:` de Tailwind (`@custom-variant dark (&:is(.dark *))` ya está configurado); no armes lógica JS para cambiar clases según el tema.
- Responsive con los prefijos estándar de Tailwind (`md:`, `lg:`...), mobile-first (las clases sin prefijo son el estilo base/mobile).

## Qué NO hacer

- No agregar `tailwind.config.js`/`.ts` — este proyecto usa el modo CSS-first de Tailwind v4 (todo el theme vive en `src/index.css` vía `@theme inline`).
- No librerías de estilos nuevas (`styled-components`, `emotion`, `sass`, `less`, CSS Modules) sin que el usuario lo pida explícitamente.
- No clases de Tailwind repetidas 3+ veces al hilo en distintos componentes sin extraerlas a un `cva()`/constante compartida.
