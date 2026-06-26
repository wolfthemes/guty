# guty

Minimal TypeScript CLI that compiles a narrow TSX-like Gutenberg structure into WordPress block markup.

## MVP

Supported elements:

- `Page`
- `Section`
- `Container`
- `Columns`
- `Column`
- `Heading`
- `Paragraph`
- `Pattern`
- `Header`
- `SiteLogo`
- `Navigation`
- `NavigationLink`
- `Button`
- `Block` (generic escape hatch for any registered block)

Example input:

```tsx
export default (
  <Page>
    <Section>
      <Container>
        <Heading level={1}>Welcome</Heading>
        <Paragraph>Hello from Guty.</Paragraph>
      </Container>
    </Section>
  </Page>
);
```

`Pattern` is a void element that references a registered block pattern by slug.
Its only supported attribute is `slug` (matching the WordPress `core/pattern`
block):

```tsx
<Pattern slug="guty/hero" />
```

compiles to:

```html
<!-- wp:pattern {"slug":"guty/hero"} /-->
```

`Header` is a group rendered with `tagName="header"`. Together with `Section`
and `Container` it accepts the shared group props `className`, `align`
(`"wide"` | `"full"`), `backgroundColor`, `textColor`, and `layout` (passed
through to the block, e.g.
`{ type: "flex", justifyContent: "space-between" }`). Without a `layout` prop
these default to `{ type: "constrained" }`.

The shared native group props also include:

- `tagName` for overriding the saved wrapper tag
- `textAlign`, which maps to `style.typography.textAlign`
- `fontSize` and `fontFamily`
- `layoutType`, `layoutContentSize`, and `layoutOrientation` as layout sugar
- spacing sugar: `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`,
  `mt`, `mr`, `mb`, `ml`
- `style` as a limited escape hatch for supported `spacing` / `typography`
  values

`SiteLogo` maps to `core/site-logo`. It is a void element and supports a narrow
set of explicit props today: `className`, `width`, `isLink`, `opensInNewTab`,
`linkTarget`, `rel`, and `shouldSyncIcon`.

`Columns` maps to `core/columns` and `Column` maps to `core/column`.
`Columns` supports `className` and `verticalAlignment`. `Column` supports
`className`, `width`, and `verticalAlignment`.

`Navigation` maps to `core/navigation` (`overlayMenu`, plus the shared group
props) and contains `NavigationLink` (void; `label`, `url`, `opensInNewTab`) and
`Button` elements. `Button` maps to `core/button` and takes `className` and
`url`; its text comes from its single text child. Note that WordPress escapes
`--` to a unicode escape in block-comment attributes (a literal `--` would
close the HTML comment) — this is expected and round-trips on parse.

```tsx
<Header className="wolf-header" align="full">
  <Container layout={{ type: "flex", justifyContent: "space-between" }}>
    <SiteLogo width={120} isLink />
    <Navigation overlayMenu="mobile">
      <NavigationLink label="Home" url="/" />
      <Button className="cta" url="/store">Browse</Button>
    </Navigation>
  </Container>
</Header>
```

`Block` is the generic escape hatch for any registered block that doesn't have a
dedicated element (including third-party blocks like `wolf-store/*`). The `name`
prop is the namespaced block name; every other prop becomes a block attribute,
in the order written. No children renders a self-closing block; children render
a wrapperless container:

```tsx
<Block name="wolf-store/theme-index" perPage={12} pagination="none" orderby="featured" />
```

compiles to:

```html
<!-- wp:wolf-store/theme-index {"perPage":12,"pagination":"none","orderby":"featured"} /-->
```

```tsx
<Block name="wolf-store/grid" columns={3}>
  <Block name="wolf-store/card" id={1} />
</Block>
```

compiles to:

```html
<!-- wp:wolf-store/grid {"columns":3} -->
<!-- wp:wolf-store/card {"id":1} /-->
<!-- /wp:wolf-store/grid -->
```

(`name` is reserved and never emitted as an attribute.)

For blocks with a real `save.js`, Guty can render the actual WordPress save
output instead of requiring pasted HTML. Point the CLI at one or more block
source roots that contain `block.json` + sibling `save.js` files:

```bash
guty build examples --out dist --blocks ../../plugins/wolf-blocks/src
```

You can also set block roots in `guty.config.json` in either the current
working directory or the input root:

```json
{
  "blocks": ["../../plugins/wolf-blocks/src"]
}
```

Then author the block with attributes only:

```tsx
<Block
  name="wolf-blocks/marquee"
  text="WolfThemes <span>Premium</span>"
  direction="left"
  animationDuration={30}
  class="my-class"
  py={40}
/>
```

When the block is registered, Guty executes its real `save` function in Node,
renders it through `@wordpress/element`, and emits that markup between the
`<!-- wp:* -->` comments. A raw HTML string child still wins as an explicit
override/fallback, and unregistered blocks keep the current self-closing or
wrapperless-container behavior.

`Block` also supports a small amount of attribute sugar before serialization:

- `class` merges into `className`
- `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` map to `style.spacing.padding.*`
- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` map to `style.spacing.margin.*`
- bare numeric spacing values become `var:preset|spacing|N`
- `align`, `fontSize`, and `fontFamily` pass through as block attributes

The `useBlockProps.save` shim currently covers a documented subset of WordPress
supports: default `wp-block-*` classes, custom `className`, `align`, spacing,
and typography-derived classes/styles. Less common supports may need adding as
new blocks require them.

If you want to bypass real-save rendering entirely, pass a single raw HTML
string child — it is emitted verbatim between the block comments:

```tsx
<Block name="wolf-blocks/marquee" direction="left">
  {`<div class="wp-block-wolf-blocks-marquee">…</div>`}
</Block>
```

A string child (raw HTML) and element children (inner blocks) cannot be mixed.
Note WordPress escapes `<`, `>`, `&`, `"`, and `--` to unicode escapes inside the
block-comment attribute JSON to keep the comment valid; this is expected and
round-trips on parse.

Native WordPress FSE content is organized by top-level directory under the chosen input root:

- `templates/` -> `.html`
- `parts/` -> `.html`
- `patterns/` -> `.php`

Example layout:

```text
examples/
  templates/
  parts/
  patterns/
```

Build command:

```bash
guty build examples --out dist
```

This preserves the directory structure in `dist/`, so `examples/templates/front-page.guty.tsx` becomes `dist/templates/front-page.html`, while `examples/patterns/hero.guty.tsx` becomes `dist/patterns/hero.php`.

Pattern files must include leading Guty metadata comments before the exported TSX:

```tsx
// @guty pattern
// title: Hero
// slug: theme/hero
// categories: featured, banner
// viewportWidth: 1400
// package: ThemeName

export default (
  <Page>{/* ... */}</Page>
);
```

Supported metadata keys: `title` and `slug` (required), plus `description`,
`categories`, `keywords`, `viewportWidth`, `inserter`, and `package`. All render
as `Label: value` docblock lines except `package`, which renders as a
`@package` tag preceded by a blank line (WordPress convention).
