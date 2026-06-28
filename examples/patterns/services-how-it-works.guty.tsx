// @guty pattern
// title: Services How It Works
// slug: guty-demo/services-how-it-works
// categories: columns, services
// description: A two-column explanation of how service orders work.
// package: GutyDemo

<Page>
	<Section
		align="full"
		className="demo-section-pad--small"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns verticalAlignment="center">
			<Column verticalAlignment="center" width="48%">
				<Heading level={2}>Order the service, send the details, and let the setup begin.</Heading>
				<Paragraph className="has-text-max-width">After checkout, the required content and access details are collected through a secure form. The sample site is configured according to the selected service.</Paragraph>
				<Paragraph className="has-text-max-width">The goal is simple: a clean, working WordPress example that gives you a reliable base for your content.</Paragraph>
			</Column>
			<Column verticalAlignment="center" width="52%">
				<Image sizeSlug="large" linkDestination="none">{`<figure class="wp-block-image size-large"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/service-how-it-works.jpg' ); ?>" alt="WordPress setup workspace" width="2000" height="1333" style="border-radius:var(--demo-radius-md)"/></figure>`}</Image>
			</Column>
		</Columns>
	</Section>
</Page>
