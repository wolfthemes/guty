// @guty pattern
// title: Music Themes Hero
// slug: seijaku-fse/music-themes-hero
// categories: hero
// package: SeijakuFSE

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>`}
		dimRatio={40}
		minHeight={72}
		minHeightUnit="vh"
		align="full"
		className="wolf-music-themes-hero is-dark has-texture"
		pt={10}
		pb={9}
	>
		<Container className="wolf-music-themes-hero__content" layoutType="constrained" layoutContentSize="920px">
			<Paragraph className="wolf-hero__eyebrow wolf-eyebrow">{`<span style="white-space:nowrap">36,000+ customers</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.5/5 on ThemeForest</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">since 2011</span>`}</Paragraph>
			<Heading level={1} textAlign="center" fontSize="display" className="wolf-music-themes-hero__title">The Best WordPress Themes for the Music Industry</Heading>
			<Paragraph textAlign="center" fontSize="md" className="wolf-tagline">Explore our collection of powerful, feature-rich WordPress themes specifically designed for musicians, artists, bands, DJs, music labels and industry professionals.</Paragraph>
			<Buttons layoutType="flex" layoutJustifyContent="center">
				<Button className="wolf-btn-lg" url="#featured-music-themes">Explore Music Themes</Button>
			</Buttons>
		</Container>
	</Cover>
</Page>
