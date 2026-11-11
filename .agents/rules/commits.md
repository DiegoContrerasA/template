# Commits

Reglas para cuando un agente (Claude, Codex, o quien sea) hace un commit en este repo. Se validan automáticamente con Husky:

- `.husky/pre-commit` → `npm run biome:check` (lint + format + las reglas de boundaries de capas de `biome.json`). Si esto falla, el commit se aborta.
- `.husky/commit-msg` → `commitlint` contra `commitlint.config.js`. Si el mensaje no matchea, el commit se aborta.

Si vas a commitear, corre `npm run biome:check` vos mismo antes de intentarlo — es más rápido detectarlo ahí que dejar que el hook lo rechace.

## Formato del mensaje

```
^((feat|fix|chore|docs|refactor|test|perf|build|ci|revert)(\([a-z0-9-]+\))?!?: .{1,72}|Revert ".*"|Merge .*)
```

Es decir: `<type>(<scope opcional>): <subject>`

- **`type`** — uno de: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `revert`. No hay otros permitidos (`type-enum` en `commitlint.config.js`).
- **`scope`** — opcional, entre paréntesis, solo `[a-z0-9-]`. En este repo normalmente es el ticket (`PROJ-123`) o el slice tocado en kebab-case (`shared`, `product-list`). Nunca mayúsculas fuera del código del ticket tal cual se usa en el repo (ver ejemplos abajo).
- **`!`** — opcional, antes de los dos puntos, para un breaking change (`feat(auth)!: ...`).
- **`subject`** — 1 a 72 caracteres. Sin mayúscula obligatoria ni punto final (`subject-case` está apagado, pero sigue el estilo del repo: minúscula, modo imperativo — "add", "fix", "update", no "added"/"adds"/"Added").

## Ejemplos reales de este repo

```
feat(PROJ-123): add product list page
fix(PROJ-123): handle empty state in product list
chore: add react-hook-form, tailwind, typescript and zod skills
chore: update dependencies
ci: add the build check
fix: correct date parsing on invoice
```

## Cuerpo y footer (opcional)

- Solo si el subject no alcanza para explicar el *por qué* del cambio (el *qué* debería quedar claro por el diff y el subject).
- Bullets cortos, uno por cambio relevante para quien lea el historial — no una narración de cada archivo tocado.
- `BREAKING CHANGE: ...` si aplica.
- No repitas en el body lo que ya dice el subject.

## Qué NO hacer

- No mezclar cambios sin relación en un mismo commit (p. ej. una feature + un `chore` de dependencias) — son dos commits.
- No usar tipos fuera de la lista (`update`, `misc`, `wip` no son válidos aquí).
- No commitear si `npm run biome:check` falla — arreglar primero, nunca `--no-verify` para saltarse el hook salvo que el usuario lo pida explícitamente.
- No hacer `git push --force` a `main` ni a una rama compartida, ni reescribir historia ya pusheada, salvo pedido explícito.
- No commitear ni pushear a menos que el usuario lo pida — armar el diff y avisar que está listo para revisión es preferible a commitear por iniciativa propia.

## Branches

Se rama desde `main`. Convención observada en el repo: `feature/<TICKET>-<slug-kebab>` (ej. `feature/PROJ-123-frontend-rules`). Para fixes fuera de una feature, `fix/<slug-kebab>` es razonable siguiendo el mismo patrón.

## Atribución de commits generados por un agente de IA

No fijes acá un formato de atribución (`Co-Authored-By`, etc.): cada harness (Claude Code, Codex...) inyecta sus propias líneas de atribución cuando corresponde. Seguí las instrucciones de atribución que te dé tu propio entorno en el momento del commit, no las que puedan haber quedado escritas en un ejemplo viejo de este archivo.
