// @guty pattern
// title: Home Music Themes CTA
// slug: seijaku-fse/home-music-themes-cta
// categories: call-to-action
// package: SeijakuFSE

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/music-themes-cta-bg.jpg' ); ?>`}
		dimRatio={60}
		minHeight={440}
		minHeightUnit="px"
		align="full"
		mt="0"
		className="wolf-music-cta is-dark has-texture"
	>
		<Container align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<Columns verticalAlignment="center">
				<Column verticalAlignment="center">
					<Heading fontSize="3-xl">Music WordPress Themes</Heading>
					<Paragraph className="wolf-tagline">Explore 20+ themes for bands, labels, festivals and music businesses.</Paragraph>
				</Column>
				<Column verticalAlignment="center" layoutType="flex" layoutJustifyContent="right">
					<Buttons layoutType="flex" layoutJustifyContent="right">
						<Button className="wolf-btn-lg" url={`<?php echo esc_url( home_url( '/music-wordpress-themes/' ) ); ?>`}>Discover Music Themes</Button>
					</Buttons>
				</Column>
			</Columns>
		</Container>
	</Cover>
</Page>
