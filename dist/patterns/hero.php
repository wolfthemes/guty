<?php
/**
 * Title: Hero
 * Slug: example/hero
 * Description: A generic introductory hero section.
 * Categories: featured, banner
 * Viewport Width: 1400
 *
 * @package ExampleSite
 */

?>

<!-- wp:group {"tagName":"section","className":"example-hero","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|10"}}},"layout":{"type":"constrained","contentSize":"760px"}} -->
<section class="wp-block-group alignfull example-hero" style="padding-top:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--10)">
	<!-- wp:paragraph {"align":"center","className":"example-eyebrow"} -->
	<p class="has-text-align-center example-eyebrow">Simple Gutenberg output</p>
	<!-- /wp:paragraph -->
	<!-- wp:heading {"level":1,"textAlign":"center","fontSize":"hero"} -->
	<h1 class="wp-block-heading has-text-align-center has-hero-font-size">Build block markup from TSX</h1>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","fontSize":"md"} -->
	<p class="has-text-align-center has-md-font-size">Use Guty examples as small, unbranded fixtures for templates, parts, and patterns.</p>
	<!-- /wp:paragraph -->
	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button -->
		<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/about">Learn more</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</section>
<!-- /wp:group -->
