// @guty pattern
// title: Services How It Works
// slug: seijaku-fse/services-how-it-works
// categories: columns, services
// description: A two-column explanation of how service orders work.
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		className="wolf-section-pad--small"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns verticalAlignment="center">
			<Column verticalAlignment="center" width="48%">
				<Heading level={2}>Order the service, send the details, and let the setup begin.</Heading>
				<Paragraph className="has-text-max-width">After checkout, you provide the required WordPress and hosting access details through a secure form. The theme is installed, configured, and prepared according to the selected service.</Paragraph>
				<Paragraph className="has-text-max-width">The goal is simple: a clean, working WordPress site that follows the theme demo direction and gives you a reliable base for your content.</Paragraph>
			</Column>
			<Column verticalAlignment="center" width="52%">
				<Image sizeSlug="large" linkDestination="none">{`<figure class="wp-block-image size-large"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/service-how-it-works.jpg' ); ?>" alt="WordPress setup workspace" width="2000" height="1333" style="border-radius:var(--wolf-radius-md)"/></figure>`}</Image>
			</Column>
		</Columns>
	</Section>
</Page>
