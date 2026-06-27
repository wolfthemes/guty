// @guty pattern
// title: Hero
// slug: seijaku-fse/home-hero
// categories: hero
// package: SeijakuFSE

<Page>
	<Container
		align="full"
		className="wolf-hero"
		layoutType="constrained"
	>
		<Container className="wolf-hero__inner" layoutType="flex" layoutOrientation="vertical">
			<Paragraph className="wolf-hero__eyebrow wolf-eyebrow">{`<span style="white-space:nowrap">36,000+ customers</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.5/5 on ThemeForest</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">since 2011</span>`}</Paragraph>
			<Heading level={1} className="wolf-hero__title">WordPress Themes for Musicians, Artists &amp; Creators</Heading>
			<Paragraph textAlign="center" className="wolf-hero__tagline wolf-hero__text-line wolf-tagline">Handcrafted themes. Direct support from the person who built them.</Paragraph>
			<Buttons className="wolf-hero__actions wolf-btn-lg" layoutType="flex" layoutJustifyContent="center">
				<Button url="/wordpress-themes">Browse Themes</Button>
			</Buttons>
		</Container>
	</Container>
</Page>
