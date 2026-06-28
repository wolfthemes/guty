// @guty pattern
// title: Example Collections Hero
// slug: guty-demo/featured-examples-hero
// categories: hero
// package: GutyDemo

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-demo.jpg' ); ?>`}
		dimRatio={40}
		minHeight={72}
		minHeightUnit="vh"
		align="full"
		className="demo-featured-examples-hero is-dark has-texture"
		pt={10}
		pb={9}
	>
		<Container className="demo-featured-examples-hero__content" layoutType="constrained" layoutContentSize="920px">
			<Paragraph className="demo-hero__eyebrow demo-eyebrow">{`<span style="white-space:nowrap">2,400+ projects</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.8/5 on the marketplace</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">in active development</span>`}</Paragraph>
			<Heading level={1} textAlign="center" fontSize="display" className="demo-featured-examples-hero__title">Flexible Example Pages for Modern Teams</Heading>
			<Paragraph textAlign="center" fontSize="md" className="demo-tagline">Explore a neutral collection of example layouts for teams, makers, publishers, and small organizations.</Paragraph>
			<Buttons layoutType="flex" layoutJustifyContent="center">
				<Button className="demo-btn-lg" url="#featured-examples">Explore Example Collections</Button>
			</Buttons>
		</Container>
	</Cover>
</Page>
