# guty

Minimal TypeScript CLI that compiles a narrow TSX-like Gutenberg structure into WordPress block markup.

## MVP

Supported elements:

- `Page`
- `Section`
- `Container`
- `Heading`
- `Paragraph`

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
