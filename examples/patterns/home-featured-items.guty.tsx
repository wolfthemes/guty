// @guty pattern
// title: Featured Templates
// slug: guty-demo/home-featured-items
// categories: query, portfolio
// package: GutyDemo

<Page>
	<Section
		className="demo-grid"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Block name="demo-store/example-index" perPage={12} pagination="none" orderby="featured" order="DESC" cardHeading="h2" />
		<Buttons layoutType="flex" layoutJustifyContent="center">
			<Button className="is-style-outline" url="/examples">See All Examples</Button>
		</Buttons>
	</Section>
</Page>
