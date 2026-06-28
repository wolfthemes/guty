<?php
/**
 * Title: Example Collections Hero
 * Slug: guty-demo/featured-examples-hero
 * Categories: hero
 *
 * @package GutyDemo
 */

?>

<!-- wp:cover {"url":"\u003c?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-demo.jpg' ); ?\u003e","dimRatio":40,"minHeight":72,"minHeightUnit":"vh","align":"full","className":"demo-featured-examples-hero is-dark has-texture","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|9"}}}} -->
<div class="wp-block-cover alignfull demo-featured-examples-hero is-dark has-texture" style="padding-top:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--9);min-height:72vh"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-demo.jpg' ); ?>" data-object-fit="cover"/><div class="wp-block-cover__inner-container">
<!-- wp:group {"className":"demo-featured-examples-hero__content","layout":{"type":"constrained","contentSize":"920px"}} -->
<div class="wp-block-group demo-featured-examples-hero__content">
	<!-- wp:paragraph {"className":"demo-hero__eyebrow demo-eyebrow"} -->
	<p class="demo-hero__eyebrow demo-eyebrow"><span style="white-space:nowrap">2,400+ projects</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.8/5 on the marketplace</span> <span class="demo-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">in active development</span></p>
	<!-- /wp:paragraph -->
	<!-- wp:heading {"level":1,"textAlign":"center","className":"demo-featured-examples-hero__title","fontSize":"display"} -->
	<h1 class="wp-block-heading has-text-align-center has-display-font-size demo-featured-examples-hero__title">Flexible Example Pages for Modern Teams</h1>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","className":"demo-tagline","fontSize":"md"} -->
	<p class="has-text-align-center has-md-font-size demo-tagline">Explore a neutral collection of example layouts for teams, makers, publishers, and small organizations.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"className":"demo-btn-lg"} -->
		<div class="wp-block-button demo-btn-lg"><a class="wp-block-button__link wp-element-button" href="#featured-examples">Explore Example Collections</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div></div>
<!-- /wp:cover -->
