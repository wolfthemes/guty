// @guty pattern
// title: Services Pricing
// slug: seijaku-fse/services-pricing
// categories: columns, services
// description: Pricing cards for WolfThemes setup and customization services.
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		className="wolf-section-pad--big"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center">Services and pricing</Heading>
		<Paragraph textAlign="center" className="wolf-tagline">Choose the level of help you need, from a focused performance pass to a complete custom website setup.</Paragraph>
		<Spacer height="var:preset|spacing|5" />
		<Columns className="wolf-section-pad--small">
			<Column layoutType="default">
				<Block name="wolf-blocks/pricing-table" tagline="Theme not included" title="Speed Optimization" price={39} buttonText="Order Now" buttonUrl="https://www.paypal.com/ncp/payment/TJB86HQUEAEX4" services={["Performance optimization","Browser caching setup","Minification of CSS and JS"]} />
			</Column>
			<Column>
				<Block name="wolf-blocks/pricing-table" tagline="Theme not included" title="Basic Installation" price={49} buttonText="Order Now" buttonUrl="https://www.paypal.com/ncp/payment/QRK8XZUPP7482" services={["Theme Installation","Demo Data Import"]} />
			</Column>
			<Column>
				<Block name="wolf-blocks/pricing-table" tagline="Theme not included" title="Complete Installation" price={69} buttonText="Order Now" buttonUrl="https://www.paypal.com/ncp/payment/3FGUFHZU49H8Q" featured={true} featuredText="Recommended" services={["Theme Installation","Demo Data Import","Speed Optimization"]} />
			</Column>
		</Columns>
	</Section>
</Page>
