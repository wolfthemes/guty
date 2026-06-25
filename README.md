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

Build command:

```bash
guty build examples --out dist
```
