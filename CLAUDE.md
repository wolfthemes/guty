# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A companion `AGENTS.md` covers contribution conventions (code style, commit/PR
> norms, testing expectations). This file focuses on architecture. Read both.

## What this is

`@guty/core` (`guty` CLI) compiles a narrow, JSX-like TSX dialect into WordPress
Gutenberg block markup. The supported element set is intentionally narrow: `Page`, `Section`,
`Container`, `Heading`, `Paragraph`, `Pattern`, `Header`, `Navigation`,
`NavigationLink`, `Button`, plus the generic `Block` escape hatch for any
registered/custom block (e.g. `wolf-store/theme-index`). Anything beyond that is
expected to throw rather than silently degrade.
`Section`/`Container`/`Header`/`Navigation` share the optional group props
`className`, `align`, and `layout` (see `readCommonAttrs` / `groupBlock` in
`compile.ts`). `Block` takes a namespaced `name` prop; all other props become
block attributes in order. A single string child of `Block` is emitted verbatim
as the block's raw static save markup (for blocks like `wolf-blocks/marquee`
that ship their own HTML); raw HTML and child blocks cannot be mixed.

Note: this package lives inside the larger `wolf-store-docker` workspace but is a
standalone tool — its remote is `git@github.com:wolfthemes/guty.git`.

## Commands

- `npm run build` — `tsc` compiles `src/` → `build/`. The CLI runs from `build/`,
  so **rebuild before invoking the CLI** after editing `src/`.
- `npm test` — runs the `vitest` suite once.
- `npx vitest run tests/render.test.ts -t "<name>"` — run a single test by name.
- `npm run dev` — rebuild, then regenerate `examples/` → `dist/`.
- `node build/cli.js build <input-dir> --out <output-dir>` — direct CLI use.

## Compile pipeline

A build is a 4-stage pipeline, one pass per `.guty.tsx` file
(`src/compiler/build.ts` orchestrates, fanning out with `Promise.all`):

1. **evaluate** (`evaluate.ts`) — Reads the file, transpiles TSX with the
   TypeScript compiler API (`jsx: React`, `jsxFactory: createElement`), and runs
   the result in a Node `vm` sandbox to get a plain `ElementNode` tree. The JSX
   runtime is **inlined as a string** (`RUNTIME_PREAMBLE`) into the transpiled
   source — it is a duplicate of `src/runtime.ts`. If you change element names or
   `createElement`/`normalizeChildren` semantics, update **both** places.
   `normalizeTemplateSource` also lets a file omit `export default` and just be a
   bare TSX expression (leading comments/blank lines are preserved as prefix).
2. **compile** (`compile.ts`) — Lowers the `ElementNode` tree to a `BlockNode`
   tree (`BlockDocument`). This is where element→block mapping and validation
   live: `Section`/`Container` → `core/group`, `Heading` → `core/heading`,
   `Paragraph` → `core/paragraph`. Text is only allowed inside `Heading`/
   `Paragraph`; the root must be `<Page>`.
3. **serialize** (`serialize.ts`) — Emits Gutenberg block-comment markup. It does
   **not** hand-write the `<!-- wp:* -->` comments: it builds a raw-block shape
   and calls `serializeRawBlock` resolved by path out of the installed
   `@wordpress/blocks` package internals. `formatMarkup` then re-indents the
   output. `toRawBlock` routes blocks three ways: `core/group` (HTML wrapper),
   HTML-leaf blocks (`HTML_LEAF_BLOCKS` → `renderLeafMarkup`, e.g.
   `<h2 class="wp-block-heading">`, `<p>`), and everything else as a
   **comment-only block** — void when it has no inner blocks (`core/pattern`,
   `core/navigation-link`, void custom blocks), or a wrapperless container
   otherwise (`core/navigation`, custom blocks with children).
4. **targets** (`targets.ts`) — Decides the output path and post-processing based
   on the **top-level directory** of the input file relative to the input root:
   `templates/` → `.html`, `parts/` → `.html`, `patterns/` → `.php`. Patterns are
   wrapped with a generated PHP header parsed from leading `// @guty pattern`
   metadata comments (see below). Any other top-level dir is an error.

`src/types.ts` defines the two trees (`ElementNode` source AST, `BlockNode`
target AST). `src/index.ts` is the public export surface; `src/cli.ts` is a thin
arg parser over `buildDirectory`.

## Pattern metadata

Files under `patterns/` must begin with a `// @guty pattern` directive followed
by `key: value` comment lines. Allowed keys are fixed in `PATTERN_HEADER_FIELDS`
(`title`, `slug`, `description`, `categories`, `keywords`, `viewportWidth`,
`inserter`, `package`); `title` and `slug` are required. Most render as
`Label: value` docblock lines; `package` renders as a `@package` tag.
Parsing/validation and the generated WordPress PHP header live in `targets.ts`.

## Gotchas

- `build/` is gitignored generated output (the published package — see the
  `files` field in `package.json`); regenerate with `npm run build`. `dist/` is
  committed example render output; regenerate with `npm run dev` rather than
  hand-editing.
- The serializer depends on a deep internal path inside `@wordpress/blocks`
  (`build/api/parser/serialize-raw-block.cjs`). A dependency bump can move it.
- Strict TS settings are on (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`); index access and optional props need care.
