// @guty pattern
// title: About Values
// slug: seijaku-fse/about-values
// categories: about, columns
// description: A simple values grid for the About page.
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		className="wolf-about-values"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns className="wolf-about-values__grid">
			<Column>
				<Paragraph className="wolf-about-values__label">Human support</Paragraph>
				<Paragraph>Clear answers from someone who knows the themes directly.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="wolf-about-values__label">Clean design</Paragraph>
				<Paragraph>Layouts that feel polished without adding visual noise.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="wolf-about-values__label">Reliable WP foundations</Paragraph>
				<Paragraph>Theme structures built for editing, updates, and long-term use.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="wolf-about-values__label">Built for real projects</Paragraph>
				<Paragraph>Practical sections for launches, portfolios, releases, and services.</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
