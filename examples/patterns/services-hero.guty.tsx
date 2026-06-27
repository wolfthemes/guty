// @guty pattern
// title: Services Hero
// slug: seijaku-fse/services-hero
// categories: hero, services
// description: A dark hero section for the Services page.
// package: SeijakuFSE

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-services.jpg' ); ?>`}
		dimRatio={40}
		minHeight={72}
		minHeightUnit="vh"
		align="full"
		className="wolf-services--hero is-dark has-texture"
		pt={10}
		pb={9}
	>
		<Container layoutType="constrained" layoutContentSize="920px">
			<Paragraph className="wolf-eyebrow">WolfThemes Services</Paragraph>
			<Heading level={1} fontSize="hero">Installation &amp; Customization Services</Heading>
			<Paragraph fontSize="md">{`Fast, hassle-free setup for WolfThemes WordPress themes,<br> from clean installation to custom website setup.`}</Paragraph>
			<Buttons>
				<Button className="wolf-btn-lg" url="/contact">Start a project</Button>
			</Buttons>
		</Container>
	</Cover>
</Page>
