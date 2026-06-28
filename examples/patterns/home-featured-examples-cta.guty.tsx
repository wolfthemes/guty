// @guty pattern
// title: Home Example Collections CTA
// slug: guty-demo/home-featured-examples-cta
// categories: call-to-action
// package: GutyDemo

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/featured-examples-cta-bg.jpg' ); ?>`}
		dimRatio={60}
		minHeight={440}
		minHeightUnit="px"
		align="full"
		mt="0"
		className="demo-featured-cta is-dark has-texture"
	>
		<Container align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<Columns verticalAlignment="center">
				<Column verticalAlignment="center">
					<Heading fontSize="3-xl">Example Collections</Heading>
					<Paragraph className="demo-tagline">Explore 20+ templates for teams, studios, festivals and featured businesses.</Paragraph>
				</Column>
				<Column verticalAlignment="center" layoutType="flex" layoutJustifyContent="right">
					<Buttons layoutType="flex" layoutJustifyContent="right">
						<Button className="demo-btn-lg" url={`<?php echo esc_url( home_url( '/featured-examples/' ) ); ?>`}>Discover Example Collections</Button>
					</Buttons>
				</Column>
			</Columns>
		</Container>
	</Cover>
</Page>
