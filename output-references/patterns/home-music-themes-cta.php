<?php
/**
 * Title: Home Music Themes CTA
 * Slug: seijaku-fse/home-music-themes-cta
 * Categories: call-to-action
 *
 * @package SeijakuFSE
 */

?>
<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri() . '/assets/images/music-themes-cta-bg.jpg' ); ?>","dimRatio":60,"minHeight":440,"minHeightUnit":"px","align":"full","style":{"spacing":{"margin":{"top":"0"}}},"className":"wolf-music-cta is-dark has-texture"} -->
<div class="wp-block-cover alignfull wolf-music-cta is-dark has-texture" style="margin-top:0;min-height:440px">
	<span aria-hidden="true" class="wp-block-cover__background has-background-dim-60 has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="Music WordPress themes — atmospheric background" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/music-themes-cta-bg.jpg' ); ?>" data-object-fit="cover" loading="lazy"/>

	<div class="wp-block-cover__inner-container">

		<!-- wp:group {"align":"full","layout":{"type":"constrained","contentSize":"var(--wp--style--global--wide-size)"}} -->
		<div class="wp-block-group alignfull">

			<!-- wp:columns {"verticalAlignment":"center"} -->
			<div class="wp-block-columns are-vertically-aligned-center">

				<!-- wp:column {"verticalAlignment":"center"} -->
				<div class="wp-block-column is-vertically-aligned-center">

					<!-- wp:heading {"fontSize":"3-xl"} -->
					<h2 class="wp-block-heading has-3-xl-font-size">Music WordPress Themes</h2>
					<!-- /wp:heading -->

					<!-- wp:paragraph { "className" : "wolf-tagline" } -->
					<p class="wolf-tagline">Explore 20+ themes for bands, labels, festivals and music businesses.</p>
					<!-- /wp:paragraph -->

				</div>
				<!-- /wp:column -->

				<!-- wp:column {"verticalAlignment":"center","layout":{"type":"flex","justifyContent":"right"}} -->
				<div class="wp-block-column is-vertically-aligned-center">

					<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"right"}} -->
					<div class="wp-block-buttons">
						<!-- wp:button {"className":"wolf-btn-lg"} -->
						<div class="wp-block-button wolf-btn-lg"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/music-wordpress-themes/' ) ); ?>">Discover Music Themes</a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->

				</div>
				<!-- /wp:column -->

			</div>
			<!-- /wp:columns -->

		</div>
		<!-- /wp:group -->

	</div>
</div>
<!-- /wp:cover -->
