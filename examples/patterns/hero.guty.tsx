// @guty pattern
// title: Hero
// slug: example/hero
// categories: featured, banner
// description: A generic introductory hero section.
// viewportWidth: 1400
// package: ExampleSite

<Page>
	<Section
		align="full"
		className="example-hero"
		pt={10}
		pb={10}
		layoutType="constrained"
		layoutContentSize="760px"
	>
		<Paragraph textAlign="center" className="example-eyebrow">Simple Gutenberg output</Paragraph>
		<Heading level={1} textAlign="center" fontSize="hero">Build block markup from TSX</Heading>
		<Paragraph textAlign="center" fontSize="md">Use Guty examples as small, unbranded fixtures for templates, parts, and patterns.</Paragraph>
		<Buttons layoutType="flex" layoutJustifyContent="center">
			<Button url="/about">Learn more</Button>
		</Buttons>
	</Section>
</Page>
