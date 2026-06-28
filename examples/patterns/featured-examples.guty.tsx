// @guty pattern
// title: Example Collections
// slug: guty-demo/featured-examples
// categories: query, portfolio
// package: GutyDemo

<Page>
	<Section
		anchor="featured-examples"
		className="demo-grid demo-section-pad--big demo-featured-examples-grid"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center" className="demo-section-title">Featured Example Collections</Heading>
		<Block name="demo-store/example-index" perPage={12} theme_cat="featured" pagination="none" orderby="featured" order="DESC" cardHeading="h3" />
		<Buttons layoutType="flex" layoutJustifyContent="center">
			<Button url="/example-category/featured/">View Complete Collection</Button>
		</Buttons>
	</Section>
</Page>
