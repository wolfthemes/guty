<?php
/**
 * Title: Music Themes Hero
 * Slug: seijaku-fse/music-themes-hero
 * Categories: hero
 *
 * @package SeijakuFSE
 */

?>
<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>","dimRatio":40,"minHeight":72,"minHeightUnit":"vh","align":"full","className":"wolf-music-themes-hero is-dark has-texture","style":{"spacing":{"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|9"}}}} -->
<div class="wp-block-cover alignfull wolf-music-themes-hero is-dark has-texture" style="padding-top:var(--wp--preset--spacing--10);padding-bottom:var(--wp--preset--spacing--9);min-height:72vh">
	<span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>" width="1673" height="1136" fetchpriority="high" data-object-fit="cover"/>

	<div class="wp-block-cover__inner-container">
		<!-- wp:group {"className":"wolf-music-themes-hero__content","layout":{"type":"constrained","contentSize":"920px"}} -->
		<div class="wp-block-group wolf-music-themes-hero__content">

			<!-- wp:paragraph {"className":"wolf-hero__eyebrow wolf-eyebrow"} -->
			<p class="wolf-hero__eyebrow wolf-eyebrow"><span style="white-space:nowrap">36,000+ customers</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">4.5/5 on ThemeForest</span> <span class="wolf-hero__eyebrow--separator" aria-hidden="true">✦</span> <span style="white-space:nowrap">since 2011</span></p>
			<!-- /wp:paragraph -->

			<!-- wp:heading { "className" : "wolf-music-themes-hero__title", "textAlign":"center","level":1,"fontSize":"display"} -->
			<h1 class="wp-block-heading has-text-align-center has-display-font-size wolf-music-themes-hero__title">The Best WordPress Themes for the Music Industry</h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"className" : "wolf-tagline", "align":"center","fontSize":"md"} -->
			<p class="has-text-align-center has-md-font-size wolf-tagline">Explore our collection of powerful, feature-rich WordPress themes specifically designed for musicians, artists, bands, DJs, music labels and industry professionals.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
			<div class="wp-block-buttons">
				<!-- wp:button {"className":"wolf-btn-lg"} -->
				<div class="wp-block-button wolf-btn-lg"><a class="wp-block-button__link wp-element-button" href="#featured-music-themes">Explore Music Themes</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:group -->
	</div>
</div>
<!-- /wp:cover -->
