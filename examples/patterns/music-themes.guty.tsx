// @guty pattern
// title: Music Themes
// slug: seijaku-fse/music-themes
// categories: query, portfolio
// package: SeijakuFSE

<Page>
	<Section
		anchor="featured-music-themes"
		className="wolf-grid wolf-section-pad--big wolf-music-themes-grid"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center" className="wolf-section-title">Featured Music Themes</Heading>
		<Block name="wolf-store/theme-index" perPage={12} theme_cat="music" pagination="none" orderby="featured" order="DESC" cardHeading="h3" />
		<Buttons layoutType="flex" layoutJustifyContent="center">
			<Button url="/theme-category/music/">View Complete Collection</Button>
		</Buttons>
	</Section>
</Page>
