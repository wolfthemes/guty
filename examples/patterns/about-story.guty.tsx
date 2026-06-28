// @guty pattern
// title: About Story
// slug: guty-demo/about-story
// categories: about, columns
// description: A concise two-column story section for Example Studio.
// package: GutyDemo

<Page>
	<Section
		align="full"
		backgroundColor="base-2"
		className="demo-about-story"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns style={{ spacing: { blockGap: { left: "var:preset|spacing|8" } } }}>
			<Column width="42%">
				<Heading level={2} className="demo-about-story__heading">A small studio for serious creative websites.</Heading>
			</Column>
			<Column width="58%">
				<Paragraph className="has-text-max-width">Example Studio is a neutral demo site used to show layouts for teams, creators, agencies, and small organizations.</Paragraph>
				<Paragraph className="has-text-max-width">Every example is shaped around real publishing needs: strong design, practical layouts, reliable foundations, and performance that does not get in the way.</Paragraph>
				<Paragraph className="has-text-max-width">The goal is to make WordPress feel clear and usable, so you can spend less time fighting your site and more time moving your work forward.</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
