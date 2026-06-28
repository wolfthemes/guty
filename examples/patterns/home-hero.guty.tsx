// @guty pattern
// title: Hero
// slug: guty-demo/home-hero
// categories: hero
// package: GutyDemo

<Page>
	<Container
		align="full"
		className="demo-hero"
		layoutType="constrained"
	>
		<Container className="demo-hero__inner" layoutType="flex" layoutOrientation="vertical">
			<Paragraph className="demo-hero__eyebrow demo-eyebrow">{`<span style="white-space:nowrap">2,400+ projects</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.8/5 on the marketplace</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">in active development</span>`}</Paragraph>
			<Heading level={1} className="demo-hero__title">Example Pages for Teams, Makers &amp; Publishers</Heading>
			<Paragraph textAlign="center" className="demo-hero__tagline demo-hero__text-line demo-tagline">Structured examples for experimenting with Gutenberg output.</Paragraph>
			<Buttons className="demo-hero__actions demo-btn-lg" layoutType="flex" layoutJustifyContent="center">
				<Button url="/examples">View Examples</Button>
			</Buttons>
		</Container>
	</Container>
</Page>
