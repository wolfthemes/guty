<?php
/**
 * Title: Home Example Collections CTA
 * Slug: guty-demo/home-featured-examples-cta
 * Categories: call-to-action
 *
 * @package GutyDemo
 */

?>

<!-- wp:cover {"url":"\u003c?php echo esc_url( get_theme_file_uri() . '/assets/images/featured-examples-cta-bg.jpg' ); ?\u003e","dimRatio":60,"minHeight":440,"minHeightUnit":"px","align":"full","className":"demo-featured-cta is-dark has-texture","style":{"spacing":{"margin":{"top":"0"}}}} -->
<div class="wp-block-cover alignfull demo-featured-cta is-dark has-texture" style="margin-top:0;min-height:440px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-60 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/featured-examples-cta-bg.jpg' ); ?>" data-object-fit="cover"/><div class="wp-block-cover__inner-container">
<!-- wp:group {"align":"full","layout":{"type":"constrained","contentSize":"var(\u002d\u002dwp\u002d\u002dstyle\u002d\u002dglobal\u002d\u002dwide-size)"}} -->
<div class="wp-block-group alignfull">
	<!-- wp:columns {"verticalAlignment":"center"} -->
	<div class="wp-block-columns are-vertically-aligned-center">
		<!-- wp:column {"verticalAlignment":"center"} -->
		<div class="wp-block-column is-vertically-aligned-center">
			<!-- wp:heading {"level":2,"fontSize":"3-xl"} -->
			<h2 class="wp-block-heading has-3-xl-font-size">Example Collections</h2>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"className":"demo-tagline"} -->
			<p class="demo-tagline">Explore 20+ templates for teams, studios, festivals and featured businesses.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"verticalAlignment":"center"} -->
		<div class="wp-block-column is-vertically-aligned-center">
			<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"className":"demo-btn-lg"} -->
				<div class="wp-block-button demo-btn-lg"><a class="wp-block-button__link wp-element-button" href="&lt;?php echo esc_url( home_url( '/featured-examples/' ) ); ?&gt;">Discover Example Collections</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
</div></div>
<!-- /wp:cover -->
