<Page>
	<Cover
		url="/wp-content/themes/seijaku-fse/assets/images/hero-music-themes.jpg"
		dimRatio={40}
		minHeight={100}
		minHeightUnit="vh"
		align="full"
		className="wolf-coming-soon-hero is-dark has-texture"
		pt={10}
		pr={5}
		pb={9}
		pl={5}
	>
		<Container layoutType="constrained" layoutContentSize="900px" style={{ justifyContent: "center" }}>
			<Paragraph textAlign="center" className="wolf-hero__eyebrow wolf-eyebrow">{`One-man studio <span class="wolf-hero__eyebrow--separator">✦</span> since 2011`}</Paragraph>
			<Heading level={1} textAlign="center" fontSize="hero" style={{ typography: { textTransform: "uppercase", letterSpacing: "0", lineHeight: "0.95" } }}>Coming Soon</Heading>
			<Paragraph textAlign="center" className="wolf-tagline">The new WolfThemes store opens July 1 with fresh WordPress themes built for creators, musicians, and ambitious brands.</Paragraph>
			<Container mt={7} layoutType="flex" layoutJustifyContent="center">
				<Block name="wolf-blocks/countdown" targetDate="2026-07-01T00:00:00" label="" fontSize="3-xl" />
			</Container>
		</Container>
	</Cover>
</Page>
