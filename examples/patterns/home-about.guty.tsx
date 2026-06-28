// @guty pattern
// title: About
// slug: guty-demo/home-about
// categories: about
// package: GutyDemo

<Page>
	<Section
		backgroundColor="base-2"
		className="demo-about demo-section-pad--big"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns verticalAlignment="center">
			<Column width="60%" className="demo-about__main">
				<Paragraph className="demo-about__eyebrow demo-eyebrow">The person behind the code</Paragraph>
				<Heading level={2} className="demo-about__title">This is a generic example section for introducing a small project.</Heading>
				<Paragraph className="demo-about__text">Use this area to describe a project, product, publication, or organization without tying the example to a specific business.</Paragraph>
				<Paragraph className="demo-about__text">When you reach out, you're talking to the person who built the example, not a queue. That's the whole reason I started selling direct.</Paragraph>
			</Column>
			<Column width="40%" className="demo-about__pullquote">
				<Paragraph>{`Several years.<br>36,000 customers.<br>4.8/5 out of 120+ reviews.<br>One person who still answers the emails.`}</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
