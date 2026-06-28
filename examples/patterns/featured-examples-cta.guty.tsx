// @guty pattern
// title: Example Collections CTA
// slug: guty-demo/featured-examples-cta
// categories: call-to-action
// package: GutyDemo

<Page>
	<Cover
		url={`<?php echo esc_url( get_theme_file_uri() . '/assets/images/featured-examples-cta-bg.jpg' ); ?>`}
		dimRatio={65}
		minHeight={440}
		minHeightUnit="px"
		align="full"
		className="demo-featured-examples-cta is-dark has-texture"
	>
		<Container layoutType="constrained" layoutContentSize="820px">
			<Heading level={2} textAlign="center" fontSize="2-xl">2,400+ teams trust Example Studio. Build your presence today.</Heading>
			<Buttons layoutType="flex" layoutJustifyContent="center">
				<Button url="/example-category/featured/">Explore Example Collections</Button>
			</Buttons>
		</Container>
	</Cover>
</Page>
