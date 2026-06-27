<?php
/**
 * Title: Services How It Works
 * Slug: seijaku-fse/services-how-it-works
 * Categories: columns, services
 * Description: A two-column explanation of how service orders work.
 *
 * @package SeijakuFSE
 */

?>
<!-- wp:group {"tagName":"section","align":"full","className":"wolf-section-pad--small","layout":{"type":"constrained","contentSize":"var(--wp--style--global--wide-size)"}} -->
<section class="wp-block-group alignfull wolf-section-pad--small">

	<!-- wp:columns {"verticalAlignment":"center"} -->
	<div class="wp-block-columns are-vertically-aligned-center">

		<!-- wp:column {"verticalAlignment":"center","width":"48%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:48%">
			<!-- wp:heading {"level":2} -->
			<h2 class="wp-block-heading">Order the service, send the details, and let the setup begin.</h2>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"className":"has-text-max-width"} -->
			<p class="has-text-max-width">After checkout, you provide the required WordPress and hosting access details through a secure form. The theme is installed, configured, and prepared according to the selected service.</p>
			<!-- /wp:paragraph -->

			<!-- wp:paragraph {"className":"has-text-max-width"} -->
			<p class="has-text-max-width">The goal is simple: a clean, working WordPress site that follows the theme demo direction and gives you a reliable base for your content.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"verticalAlignment":"center","width":"52%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:52%">
			<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
			<figure class="wp-block-image size-large"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/service-how-it-works.jpg' ); ?>" alt="WordPress setup workspace" width="2000" height="1333" style="border-radius:var(--wolf-radius-md)"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->

	</div>
	<!-- /wp:columns -->

</section>
<!-- /wp:group -->
