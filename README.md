# guty

Minimal TypeScript CLI that compiles a narrow TSX-like Gutenberg structure into WordPress block markup.

## MVP

Supported elements:

- `Page`
- `Section`
- `Container`
- `Heading`
- `Paragraph`
- `Pattern`
- `Header`
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
(`"wide"` | `"full"`), and `layout` (passed through to the block, e.g.
`{ type: "flex", justifyContent: "space-between" }`). Without a `layout` prop
these default to `{ type: "constrained" }`.

`Navigation` maps to `core/navigation` (`overlayMenu`, plus the shared group
props) and contains `NavigationLink` (void; `label`, `url`, `opensInNewTab`) and
`Button` elements. `Button` maps to `core/button` and takes `className` and
`url`; its text comes from its single text child. Note that WordPress escapes
`--` to a unicode escape in block-comment attributes (a literal `--` would
close the HTML comment) — this is expected and round-trips on parse.

```tsx
<Header className="wolf-header" align="full">
  <Container layout={{ type: "flex", justifyContent: "space-between" }}>
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

export default (
  <Page>{/* ... */}</Page>
);
```
