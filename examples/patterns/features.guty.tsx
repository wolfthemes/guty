// @guty pattern
// title: Features
// slug: example/features
// categories: columns, featured
// description: A generic three-column feature section.
// package: ExampleSite

<Page>
	<Section
		align="full"
		backgroundColor="base-2"
		className="example-features"
		pt={8}
		pb={8}
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center">What this fixture covers</Heading>
		<Columns>
			<Column>
				<Heading level={3} fontSize="lg">Patterns</Heading>
				<Paragraph>Compile reusable sections into PHP pattern files with metadata headers.</Paragraph>
			</Column>
			<Column>
				<Heading level={3} fontSize="lg">Templates</Heading>
				<Paragraph>Compile full-site editing templates into WordPress HTML files.</Paragraph>
			</Column>
			<Column>
				<Heading level={3} fontSize="lg">Parts</Heading>
				<Paragraph>Compile headers, footers, and other template parts from the same syntax.</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
