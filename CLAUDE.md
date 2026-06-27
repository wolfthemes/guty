# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A companion `AGENTS.md` covers contribution conventions (code style, commit/PR
> norms, testing expectations). This file focuses on architecture. Read both.

## What this is

`@guty/core` (`guty` CLI) compiles a narrow, JSX-like TSX dialect into WordPress
Gutenberg block markup. The supported element set is intentionally narrow: `Page`, `Section`,
`Container`, `Columns`, `Column`, `Heading`, `Paragraph`, `Pattern`, `Header`, `Footer`, `SiteLogo`, `Navigation`,
`NavigationLink`, `Button`, `List`, `ListItem`, `Link`, plus the generic `Block` escape hatch for any
registered/custom block (e.g. `wolf-store/theme-index`). Anything beyond that is
expected to throw rather than silently degrade.
`Link` is an inline element only valid as a child of `ListItem` — it renders
to `<a href="...">children</a>` in innerHTML. Props: `href` (required), `target`, `rel`.
Text is passed as children, not a prop: `<Link href="/">Home</Link>`.

`Section`/`Container`/`Navigation` share the optional group props
`className`, `align`, `backgroundColor`, `textColor`, and `layout` (see
`readCommonAttrs` / `groupBlock` in `compile.ts`). `Header` and `Footer` are
void sugar over `core/template-part` — they require only a `slug` prop and
pre-set `tagName` and `area` to `"header"`/`"footer"` respectively. Use
`TemplatePart` directly for any non-standard area. `Block` takes a namespaced
`name` prop; all other props become
block attributes in order. If a matching custom block is registered via
`--blocks` / `guty.config.json`, `compile.ts` can call its real `save.js`
through the block renderer in `src/compiler/blocks.ts`; otherwise the block
falls back to the old comment-only behavior. A single string child of `Block`
is emitted verbatim as the block's raw static save markup and overrides the
real-save path; raw HTML and child blocks cannot be mixed.

Note: this package lives inside the larger `wolf-store-docker` workspace but is a
standalone tool — its remote is `git@github.com:wolfthemes/guty.git`.

## Commands

- `npm run build` — `tsc` compiles `src/` → `build/`. The CLI runs from `build/`,
  so **rebuild before invoking the CLI** after editing `src/`.
- `npm test` — runs the `vitest` suite once.
- `npx vitest run tests/render.test.ts -t "<name>"` — run a single test by name.
- `npm run dev` — rebuild, then regenerate `examples/` → `dist/`.
- `node build/cli.js build <input-dir> --out <output-dir> [--blocks <dir>]...`
  — direct CLI use, optionally loading custom blocks from source trees.

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
   tree (`BlockDocument`). This is where element→block mapping, validation, and
   `Block` sugar live: `Section`/`Container` → `core/group`, `Heading` →
   `core/columns`, `Column` → `core/column`, `core/heading`, `Paragraph` → `core/paragraph`, `SiteLogo` →
   `core/site-logo`. `readCommonAttrs` also handles native group sugar:
   `textAlign`, `fontSize`, `fontFamily`, `layoutType`,
   `layoutContentSize`, `layoutOrientation`, and spacing shorthands like `py`
   / `mt`. `applyBlockSugar` maps
   `class` → `className`, spacing shorthands like `py` / `mt` into
   `style.spacing`, and passes the result to the block renderer when a custom
   block has been registered. Text is only allowed inside `Heading`/
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

`src/compiler/blocks.ts` is the custom-block bridge. It scans `--blocks`
directories for `block.json` + sibling `save.js`, transpiles `save.js` through
the shared TS helper, and executes it in a `vm` with shims for
`@wordpress/block-editor` (`useBlockProps.save`) and `@wordpress/i18n`. The
`useBlockProps.save` shim intentionally implements only a subset of WordPress
supports today: default `wp-block-*` classes, `className`, `align`, spacing,
and typography-derived classes/styles.

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
