// @guty pattern
// title: About Intro
// slug: guty-demo/about-intro
// categories: about, text
// description: A minimal personal introduction for the About page.
// package: GutyDemo

<Page>
	<Section
		align="full"
		className="demo-section-pad--small"
		layoutType="constrained"
		layoutContentSize="720px"
	>
		<Image
			align="center"
			width="120px"
			height="120px"
			scale="cover"
			sizeSlug="thumbnail"
			linkDestination="none"
			style={{ border: { radius: "999px" } }}
		>{`<figure class="wp-block-image aligncenter size-thumbnail is-resized has-custom-border"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/me.jpg' ); ?>" alt="Jordan Example, maintainer of Example Studio" width="180" height="180" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>`}</Image>
		<Heading level={1} textAlign="center" fontSize="hero">Hi there,</Heading>
		<Paragraph textAlign="center" fontSize="md">I'm Jordan, the maintainer of this demo site. These examples show how Guty structures pages for people who need a site that looks sharp, works reliably, and stays easy to manage.</Paragraph>
	</Section>
</Page>
