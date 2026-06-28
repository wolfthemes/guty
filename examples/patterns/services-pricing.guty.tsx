// @guty pattern
// title: Services Pricing
// slug: guty-demo/services-pricing
// categories: columns, services
// description: Pricing cards for Example Studio setup and customization services.
// package: GutyDemo

<Page>
	<Section
		align="full"
		className="demo-section-pad--big"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center">Services and pricing</Heading>
		<Paragraph textAlign="center" className="demo-tagline">Choose the level of help you need, from a focused performance pass to a complete custom website setup.</Paragraph>
		<Spacer height="var:preset|spacing|5" />
		<Columns className="demo-section-pad--small">
			<Column layoutType="default">
				<Block name="demo-blocks/pricing-table" tagline="Content not included" title="Performance Review" price={39} buttonText="Order Now" buttonUrl="https://example.com/checkout" services={["Performance optimization","Browser caching setup","Minification of CSS and JS"]} />
			</Column>
			<Column>
				<Block name="demo-blocks/pricing-table" tagline="Content not included" title="Basic Setup" price={49} buttonText="Order Now" buttonUrl="https://example.com/checkout" services={["Example Setup","Sample Content Import"]} />
			</Column>
			<Column>
				<Block name="demo-blocks/pricing-table" tagline="Content not included" title="Complete Setup" price={69} buttonText="Order Now" buttonUrl="https://example.com/checkout" featured={true} featuredText="Recommended" services={["Example Setup","Sample Content Import","Performance Review"]} />
			</Column>
		</Columns>
	</Section>
</Page>
