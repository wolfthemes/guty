<?php
/**
 * Title: Features
 * Slug: example/features
 * Description: A generic three-column feature section.
 * Categories: columns, featured
 *
 * @package ExampleSite
 */

?>

<!-- wp:group {"tagName":"section","backgroundColor":"base-2","className":"example-features","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|8","bottom":"var:preset|spacing|8"}}},"layout":{"type":"constrained","contentSize":"var(\u002d\u002dwp\u002d\u002dstyle\u002d\u002dglobal\u002d\u002dwide-size)"}} -->
<section class="wp-block-group alignfull has-base-2-background-color has-background example-features" style="padding-top:var(--wp--preset--spacing--8);padding-bottom:var(--wp--preset--spacing--8)">
	<!-- wp:heading {"level":2,"textAlign":"center"} -->
	<h2 class="wp-block-heading has-text-align-center">What this fixture covers</h2>
	<!-- /wp:heading -->
	<!-- wp:columns -->
	<div class="wp-block-columns">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:heading {"level":3,"fontSize":"lg"} -->
			<h3 class="wp-block-heading has-lg-font-size">Patterns</h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph -->
			<p>Compile reusable sections into PHP pattern files with metadata headers.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:heading {"level":3,"fontSize":"lg"} -->
			<h3 class="wp-block-heading has-lg-font-size">Templates</h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph -->
			<p>Compile full-site editing templates into WordPress HTML files.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:heading {"level":3,"fontSize":"lg"} -->
			<h3 class="wp-block-heading has-lg-font-size">Parts</h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph -->
			<p>Compile headers, footers, and other template parts from the same syntax.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</section>
<!-- /wp:group -->
