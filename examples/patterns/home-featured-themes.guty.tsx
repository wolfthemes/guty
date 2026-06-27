// @guty pattern
// title: Featured Themes
// slug: seijaku-fse/home-featured-themes
// categories: query, portfolio
// package: SeijakuFSE

<Page>
	<Section
		className="wolf-grid"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Block name="wolf-store/theme-index" perPage={12} pagination="none" orderby="featured" order="DESC" cardHeading="h2" />
		<Buttons layoutType="flex" layoutJustifyContent="center">
			<Button className="is-style-outline" url="/wordpress-themes">See All Themes</Button>
		</Buttons>
	</Section>
</Page>
