<?php
/**
 * Title: About Story
 * Slug: guty-demo/about-story
 * Description: A concise two-column story section for Example Studio.
 * Categories: about, columns
 *
 * @package GutyDemo
 */

?>

<!-- wp:group {"tagName":"section","backgroundColor":"base-2","className":"demo-about-story","align":"full","layout":{"type":"constrained","contentSize":"var(\u002d\u002dwp\u002d\u002dstyle\u002d\u002dglobal\u002d\u002dwide-size)"}} -->
<section class="wp-block-group alignfull has-base-2-background-color has-background demo-about-story">
	<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var:preset|spacing|8"}}}} -->
	<div class="wp-block-columns">
		<!-- wp:column {"width":"42%"} -->
		<div class="wp-block-column" style="flex-basis:42%">
			<!-- wp:heading {"level":2,"className":"demo-about-story__heading"} -->
			<h2 class="wp-block-heading demo-about-story__heading">A small studio for serious creative websites.</h2>
			<!-- /wp:heading -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"width":"58%"} -->
		<div class="wp-block-column" style="flex-basis:58%">
			<!-- wp:paragraph {"className":"has-text-max-width"} -->
			<p class="has-text-max-width">Example Studio is a neutral demo site used to show layouts for teams, creators, agencies, and small organizations.</p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"className":"has-text-max-width"} -->
			<p class="has-text-max-width">Every example is shaped around real publishing needs: strong design, practical layouts, reliable foundations, and performance that does not get in the way.</p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"className":"has-text-max-width"} -->
			<p class="has-text-max-width">The goal is to make WordPress feel clear and usable, so you can spend less time fighting your site and more time moving your work forward.</p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</section>
<!-- /wp:group -->
