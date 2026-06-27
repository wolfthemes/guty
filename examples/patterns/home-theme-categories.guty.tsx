// @guty pattern
// title: Theme Categories
// slug: seijaku-fse/home-theme-categories
// categories: columns, featured
// package: SeijakuFSE

<Page>
	<Section
		className="wolf-section-pad--big"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Paragraph className="wolf-eyebrow">Browse by category</Paragraph>
		<Heading level={2}>Themes for every kind of project.</Heading>
		<Spacer height="var:preset|spacing|6" />
		<Columns className="wolf-cat-grid">
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>`}
					dimRatio={10}
					minHeight={440}
					minHeightUnit="px"
					className="wolf-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/theme-category/music/' ) ); ?>">Music</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Bands, labels &amp; festivals</Paragraph>
				</Cover>
			</Column>
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>`}
					dimRatio={30}
					minHeight={440}
					minHeightUnit="px"
					className="wolf-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/theme-category/creative/' ) ); ?>">Creative</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Studios, agencies &amp; portfolios</Paragraph>
				</Cover>
			</Column>
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>`}
					dimRatio={60}
					minHeight={440}
					minHeightUnit="px"
					className="wolf-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/theme-category/portfolio/' ) ); ?>">Portfolio</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Personal &amp; brand sites</Paragraph>
				</Cover>
			</Column>
		</Columns>
	</Section>
</Page>
