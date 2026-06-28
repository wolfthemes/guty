<?php
/**
 * Title: Services Pricing
 * Slug: guty-demo/services-pricing
 * Description: Pricing cards for Example Studio setup and customization services.
 * Categories: columns, services
 *
 * @package GutyDemo
 */

?>

<!-- wp:group {"tagName":"section","className":"demo-section-pad\u002d\u002dbig","align":"full","layout":{"type":"constrained","contentSize":"var(\u002d\u002dwp\u002d\u002dstyle\u002d\u002dglobal\u002d\u002dwide-size)"}} -->
<section class="wp-block-group alignfull demo-section-pad--big">
	<!-- wp:heading {"level":2,"textAlign":"center"} -->
	<h2 class="wp-block-heading has-text-align-center">Services and pricing</h2>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","className":"demo-tagline"} -->
	<p class="has-text-align-center demo-tagline">Choose the level of help you need, from a focused performance pass to a complete custom website setup.</p>
	<!-- /wp:paragraph -->
	<!-- wp:spacer {"height":"var:preset|spacing|5"} -->
	<div style="height:var(--wp--preset--spacing--5)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
	<!-- wp:columns {"className":"demo-section-pad\u002d\u002dsmall"} -->
	<div class="wp-block-columns demo-section-pad--small">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:demo-blocks/pricing-table {"tagline":"Content not included","title":"Performance Review","price":39,"buttonText":"Order Now","buttonUrl":"https://example.com/checkout","services":["Performance optimization","Browser caching setup","Minification of CSS and JS"]} /-->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:demo-blocks/pricing-table {"tagline":"Content not included","title":"Basic Setup","price":49,"buttonText":"Order Now","buttonUrl":"https://example.com/checkout","services":["Example Setup","Sample Content Import"]} /-->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:demo-blocks/pricing-table {"tagline":"Content not included","title":"Complete Setup","price":69,"buttonText":"Order Now","buttonUrl":"https://example.com/checkout","featured":true,"featuredText":"Recommended","services":["Example Setup","Sample Content Import","Performance Review"]} /-->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</section>
<!-- /wp:group -->
