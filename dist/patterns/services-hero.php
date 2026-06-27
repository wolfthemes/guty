<?php
/**
 * Title: Services Hero
 * Slug: seijaku-fse/services-hero
 * Description: A dark hero section for the Services page.
 * Categories: hero, services
 *
 * @package SeijakuFSE
 */

?>

<!-- wp:cover {"url":"\u003c?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-services.jpg' ); ?\u003e","dimRatio":40,"minHeight":72,"minHeightUnit":"vh","align":"full","className":"wolf-services\u002d\u002dhero is-dark has-texture","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|9"}}}} -->
<div class="wp-block-cover alignfull wolf-services--hero is-dark has-texture" style="padding-top:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--9);min-height:72vh"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-services.jpg' ); ?>" data-object-fit="cover"/><div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"920px"}} -->
<div class="wp-block-group">
	<!-- wp:paragraph {"className":"wolf-eyebrow"} -->
	<p class="wolf-eyebrow">WolfThemes Services</p>
	<!-- /wp:paragraph -->
	<!-- wp:heading {"level":1,"fontSize":"hero"} -->
	<h1 class="wp-block-heading has-hero-font-size">Installation &amp; Customization Services</h1>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"fontSize":"md"} -->
	<p class="has-md-font-size">Fast, hassle-free setup for WolfThemes WordPress themes,<br> from clean installation to custom website setup.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons -->
	<div class="wp-block-buttons">
		<!-- wp:button {"className":"wolf-btn-lg"} -->
		<div class="wp-block-button wolf-btn-lg"><a class="wp-block-button__link wp-element-button" href="/contact">Start a project</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div></div>
<!-- /wp:cover -->
