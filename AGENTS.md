# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the TypeScript source for the package. The CLI entry point is `src/cli.ts`, public exports live in `src/index.ts`, and compiler stages are grouped under `src/compiler/` (`build`, `compile`, `evaluate`, `serialize`). Shared types are in `src/types.ts` and runtime helpers in `src/runtime.ts`.

`tests/` holds `vitest` coverage, currently centered on rendering and directory builds in `tests/render.test.ts`. `examples/` contains sample `.guty.tsx` templates, while `dist/` is generated output and `build/` is the compiled Node package emitted by TypeScript.

## Build, Test, and Development Commands
Use Node 20+ and install dependencies with `npm install`.

- `npm run build` compiles `src/` into `build/` with `tsc`.
- `npm test` runs the `vitest` suite once.
- `npm run dev` rebuilds the package and runs `node build/cli.js build examples --out dist` to regenerate example HTML.
- `node build/cli.js build examples --out dist` is the direct CLI invocation once the package is built.

## Coding Style & Naming Conventions
This repository uses ESM TypeScript with strict compiler settings (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). Follow `.editorconfig`: tabs for most files, 4-column tab width, UTF-8, and LF line endings. JSON and YAML use 2 spaces.

Prefer small, focused modules and named exports. Use `camelCase` for functions and variables, `PascalCase` for interfaces and TSX element types like `Page` or `Heading`, and keep filenames lowercase unless they mirror a `.guty.tsx` template name.

## Testing Guidelines
Add or update `vitest` cases for every compiler or CLI behavior change. Keep tests near real usage patterns: build fixtures from `.guty.tsx` inputs, assert serialized Gutenberg output, and cover error paths when changing argument parsing or template evaluation.

Name tests by behavior, for example `it("compiles .guty.tsx files into html output", ...)`. Run `npm test` before opening a PR.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `Add editor config` and `Fix CLI typing and template evaluation`. Keep subjects concise, capitalized, and action-first.

PRs should explain the user-visible change, note any CLI or output-format impact, and include updated examples or tests when behavior changes. If generated output in `dist/` is relevant to the review, mention how it was produced.
