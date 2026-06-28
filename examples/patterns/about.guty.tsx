// @guty pattern
// title: About
// slug: guty-demo/home-about
// categories: about
// package: GutyDemo

<Page>
	<Section
		tagName="section"
		backgroundColor="base-2"
		className="demo-about demo-section-pad--big "
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns verticalAlignment="center">
			<Column width="60%" className="demo-about__main">
				<Paragraph className="demo-about__eyebrow demo-eyebrow">The person behind the code</Paragraph>
				<Heading level={2} className="demo-about__title">
					This is a generic example section for introducing a small project.
				</Heading>
				<Paragraph className="demo-about__text">
					No agency, no rotating dev team, no outsourced support tickets. Every example here started as a
					real problem someone brought to me: a band needing a tour page, a label needing a catalogue
					that didn't feel like a spreadsheet.
				</Paragraph>
				<Paragraph className="demo-about__text">
					When you reach out, you're talking to the person who built the example, not a queue. That's the
					whole reason I started selling direct.
				</Paragraph>
			</Column>
			<Column width="40%" className="demo-about__pullquote">
				<Block name="core/paragraph">
					{`Several years.<br>36,000 customers.<br>4.8/5 out of 120+ reviews.<br>One person who still answers the emails.`}
				</Block>
			</Column>
		</Columns>
	</Section>
</Page>
