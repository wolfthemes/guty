// @guty pattern
// title: About Story
// slug: seijaku-fse/about-story
// categories: about, columns
// description: A concise two-column story section for WolfThemes.
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		backgroundColor="base-2"
		className="wolf-about-story"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns style={{ spacing: { blockGap: { left: "var:preset|spacing|8" } } }}>
			<Column width="42%">
				<Heading level={2} className="wolf-about-story__heading">A small studio for serious creative websites.</Heading>
			</Column>
			<Column width="58%">
				<Paragraph className="has-text-max-width">WolfThemes has been an independent WordPress theme studio since 2011, focused on websites for musicians, artists, agencies, freelancers, and creative businesses.</Paragraph>
				<Paragraph className="has-text-max-width">Every theme is shaped around real publishing needs: strong design, practical layouts, reliable foundations, and performance that does not get in the way.</Paragraph>
				<Paragraph className="has-text-max-width">The goal is to make WordPress feel clear and usable, so you can spend less time fighting your site and more time moving your work forward.</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
