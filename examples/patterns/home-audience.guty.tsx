// @guty pattern
// title: Audience
// slug: seijaku-fse/home-audience
// categories: columns, featured
// package: SeijakuFSE

<Page>
	<Section
		className="wolf-section-pad--big"
		align="full"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center">Built for creative teams and independent makers.</Heading>
		<Spacer height="var:preset|spacing|5" />
		<Block
			name="wolf-blocks/feature-grid"
			columns={3}
		>
			<Block name="wolf-blocks/feature-grid-item" icon="starFilled" title="Musicians and labels" description="Publish releases, tours, media, and merchandise with layouts made for music-focused sites." />
			<Block name="wolf-blocks/feature-grid-item" icon="layout" title="Studios and agencies" description="Present work, services, case studies, and announcements with polished editorial sections." />
			<Block name="wolf-blocks/feature-grid-item" icon="tag" title="Shops and creators" description="Launch a flexible brand site that can support products, updates, and long-term content." />
		</Block>
	</Section>
</Page>
