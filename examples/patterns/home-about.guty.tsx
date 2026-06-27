// @guty pattern
// title: About
// slug: seijaku-fse/home-about
// categories: about
// package: SeijakuFSE

<Page>
	<Section
		backgroundColor="base-2"
		className="wolf-about wolf-section-pad--big"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns verticalAlignment="center">
			<Column width="60%" className="wolf-about__main">
				<Paragraph className="wolf-about__eyebrow wolf-eyebrow">The person behind the code</Paragraph>
				<Heading level={2} className="wolf-about__title">I'm Constantin. For 14 years, I've been the only person writing every line of WolfThemes.</Heading>
				<Paragraph className="wolf-about__text">No agency, no rotating dev team, no outsourced support tickets. Every theme here started as a real problem someone brought to me: a band needing a tour page, a label needing a catalogue that didn't feel like a spreadsheet.</Paragraph>
				<Paragraph className="wolf-about__text">When you reach out, you're talking to the person who built the theme, not a queue. That's the whole reason I started selling direct.</Paragraph>
			</Column>
			<Column width="40%" className="wolf-about__pullquote">
				<Paragraph>{`14 years.<br>36,000 customers.<br>4.5/5 out of 1600+ ratings.<br>One person who still answers the emails.`}</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
