<Page>
	<Cover
		url="/wp-content/themes/guty-demo/assets/images/hero-demo.jpg"
		dimRatio={40}
		minHeight={100}
		minHeightUnit="vh"
		align="full"
		className="demo-coming-soon-hero is-dark has-texture"
		pt={10}
		pr={5}
		pb={9}
		pl={5}
	>
		<Container layoutType="constrained" layoutContentSize="900px" style={{ justifyContent: "center" }}>
			<Paragraph textAlign="center" className="demo-hero__eyebrow demo-eyebrow">{`Small example project <span class="demo-hero__eyebrow--separator">✦</span> in active development`}</Paragraph>
			<Heading level={1} textAlign="center" fontSize="hero" style={{ typography: { textTransform: "uppercase", letterSpacing: "0", lineHeight: "0.95" } }}>Coming Soon</Heading>
			<Paragraph textAlign="center" className="demo-tagline">The new Example Studio project library opens July 1 with fresh example pages built for creators, teams, and ambitious brands.</Paragraph>
			<Container mt={7} layoutType="flex" layoutJustifyContent="center">
				<Block name="demo-blocks/countdown" targetDate="2026-07-01T00:00:00" label="" fontSize="3-xl" />
			</Container>
		</Container>
	</Cover>
</Page>
