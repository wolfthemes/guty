// @guty pattern
// title: Example Categories
// slug: guty-demo/home-example-categories
// categories: columns, featured
// package: GutyDemo

<Page>
	<Section
		className="demo-section-pad--big"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Paragraph className="demo-eyebrow">Browse by category</Paragraph>
		<Heading level={2}>Templates for every kind of project.</Heading>
		<Spacer height="var:preset|spacing|6" />
		<Columns className="demo-cat-grid">
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-demo.jpg' ); ?>`}
					dimRatio={10}
					minHeight={440}
					minHeightUnit="px"
					className="demo-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/example-category/featured/' ) ); ?>">Featured</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Bands, studios &amp; festivals</Paragraph>
				</Cover>
			</Column>
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>`}
					dimRatio={30}
					minHeight={440}
					minHeightUnit="px"
					className="demo-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/example-category/creative/' ) ); ?>">Creative</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Studios, agencies &amp; portfolios</Paragraph>
				</Cover>
			</Column>
			<Column>
				<Cover
					url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>`}
					dimRatio={60}
					minHeight={440}
					minHeightUnit="px"
					className="demo-cat-card is-dark has-texture"
				>
					<Heading level={3} textAlign="center">{`<a href="<?php echo esc_url( home_url( '/example-category/portfolio/' ) ); ?>">Portfolio</a>`}</Heading>
					<Paragraph textAlign="center" fontSize="sm">Personal &amp; brand sites</Paragraph>
				</Cover>
			</Column>
		</Columns>
	</Section>
</Page>
