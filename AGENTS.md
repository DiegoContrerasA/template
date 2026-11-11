# Instrucciones para agentes de código

Antes de escribir o editar código en este repo, leé **[`.agents/rules/orquestador.md`](./.agents/rules/orquestador.md)** — es el índice de todas las reglas (arquitectura, estilo de código, componentes, servicios/hooks, Tailwind, templates de ejemplo y convención de commits) y te dice cuál leer según lo que vayas a hacer.

La arquitectura completa del proyecto (capas `entities/`, `features/`, `widgets/`, `pages/`, `shared/`, `app/` y qué puede importar de qué) vive en **[`README.md`](./README.md)**.

## Comandos

```bash
npm run dev            # servidor de desarrollo
npm run build           # biome:check + type-check + build de producción
npm run biome:check     # lint + format (aplica fixes) — corré esto antes de dar algo por terminado
```

`npm run biome:check` incluye las reglas de `biome.json` que bloquean imports entre capas que violan la arquitectura (ver `README.md`). Si falla por eso, es una señal de que algo está en la capa equivocada, no un lint a ignorar.
