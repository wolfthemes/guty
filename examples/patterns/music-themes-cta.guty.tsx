// @guty pattern
// title: Music Themes CTA
// slug: seijaku-fse/music-themes-cta
// categories: call-to-action
// package: SeijakuFSE

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/music-themes-cta-bg.jpg' ); ?>`}
		dimRatio={65}
		minHeight={440}
		minHeightUnit="px"
		align="full"
		className="wolf-music-themes-cta is-dark has-texture"
	>
		<Container layoutType="constrained" layoutContentSize="820px">
			<Heading level={2} textAlign="center" fontSize="2-xl">36,000+ musicians trust WolfThemes. Build your presence today.</Heading>
			<Buttons layoutType="flex" layoutJustifyContent="center">
				<Button url="/theme-category/music/">Explore Music Themes</Button>
			</Buttons>
		</Container>
	</Cover>
</Page>
