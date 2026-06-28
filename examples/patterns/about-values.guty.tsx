// @guty pattern
// title: About Values
// slug: guty-demo/about-values
// categories: about, columns
// description: A simple values grid for the About page.
// package: GutyDemo

<Page>
	<Section
		align="full"
		className="demo-about-values"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns className="demo-about-values__grid">
			<Column>
				<Paragraph className="demo-about-values__label">Human support</Paragraph>
				<Paragraph>Clear answers from someone who knows the examples directly.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="demo-about-values__label">Clean design</Paragraph>
				<Paragraph>Layouts that feel polished without adding visual noise.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="demo-about-values__label">Reliable WP foundations</Paragraph>
				<Paragraph>Example structures built for editing, updates, and long-term use.</Paragraph>
			</Column>
			<Column>
				<Paragraph className="demo-about-values__label">Built for real projects</Paragraph>
				<Paragraph>Practical sections for launches, portfolios, releases, and services.</Paragraph>
			</Column>
		</Columns>
	</Section>
</Page>
