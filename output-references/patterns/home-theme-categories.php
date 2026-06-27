<?php
/**
 * Title: Theme Categories
 * Slug: seijaku-fse/home-theme-categories
 * Categories: columns, featured
 *
 * @package SeijakuFSE
 */

?>
<!-- wp:group {"tagName":"section","className":"wolf-section-pad--big","align":"full","layout":{"type":"constrained","contentSize":"var(--wp--style--global--wide-size)"}} -->
<section class="wp-block-group alignfull wolf-section-pad--big">

	<!-- wp:paragraph {"className":"wolf-eyebrow"} -->
	<p class="wolf-eyebrow">Browse by category</p>
	<!-- /wp:paragraph -->

	<!-- wp:heading {"level":2} -->
	<h2 class="wp-block-heading">Themes for every kind of project.</h2>
	<!-- /wp:heading -->

	<!-- wp:spacer {"height":"var:preset|spacing|6"} -->
	<div style="height:var(--wp--preset--spacing--6)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:columns {"className":"wolf-cat-grid"} -->
	<div class="wp-block-columns wolf-cat-grid">

		<!-- wp:column -->
		<div class="wp-block-column">

			<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>","dimRatio":10,"minHeight":440,"minHeightUnit":"px","className":"wolf-cat-card is-dark has-texture"} -->
			<div class="wp-block-cover wolf-cat-card is-dark has-texture" style="min-height:440px">
				<span aria-hidden="true" class="wp-block-cover__background has-background-dim-10 has-background-dim"></span>
				<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-music-themes.jpg' ); ?>" data-object-fit="cover"/>
				<div class="wp-block-cover__inner-container">

					<!-- wp:heading {"textAlign":"center","level":3} -->
					<h3 class="wp-block-heading has-text-align-center"><a href="<?php echo esc_url( home_url( '/theme-category/music/' ) ); ?>">Music</a></h3>
					<!-- /wp:heading -->

					<!-- wp:paragraph {"align":"center","fontSize":"sm"} -->
					<p class="has-text-align-center has-sm-font-size">Bands, labels &amp; festivals</p>
					<!-- /wp:paragraph -->

				</div>
			</div>
			<!-- /wp:cover -->

		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">

			<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>","dimRatio":30,"minHeight":440,"minHeightUnit":"px","className":"wolf-cat-card is-dark has-texture"} -->
			<div class="wp-block-cover wolf-cat-card is-dark has-texture" style="min-height:440px">
				<span aria-hidden="true" class="wp-block-cover__background has-background-dim-30 has-background-dim"></span>
				<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>" data-object-fit="cover"/>
				<div class="wp-block-cover__inner-container">

					<!-- wp:heading {"textAlign":"center","level":3} -->
					<h3 class="wp-block-heading has-text-align-center"><a href="<?php echo esc_url( home_url( '/theme-category/creative/' ) ); ?>">Creative</a></h3>
					<!-- /wp:heading -->

					<!-- wp:paragraph {"align":"center","fontSize":"sm"} -->
					<p class="has-text-align-center has-sm-font-size">Studios, agencies &amp; portfolios</p>
					<!-- /wp:paragraph -->

				</div>
			</div>
			<!-- /wp:cover -->

		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">

			<?php // TODO: third category is TBD — update label, link slug and image. ?>
			<!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>","dimRatio":60,"minHeight":440,"minHeightUnit":"px","className":"wolf-cat-card is-dark has-texture"} -->
			<div class="wp-block-cover wolf-cat-card is-dark has-texture" style="min-height:440px">
				<span aria-hidden="true" class="wp-block-cover__background has-background-dim-60 has-background-dim"></span>
				<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>" data-object-fit="cover"/>
				<div class="wp-block-cover__inner-container">

					<!-- wp:heading {"textAlign":"center","level":3} -->
					<h3 class="wp-block-heading has-text-align-center"><a href="<?php echo esc_url( home_url( '/theme-category/portfolio/' ) ); ?>">Portfolio</a></h3>
					<!-- /wp:heading -->

					<!-- wp:paragraph {"align":"center","fontSize":"sm"} -->
					<p class="has-text-align-center has-sm-font-size">Personal &amp; brand sites</p>
					<!-- /wp:paragraph -->

				</div>
			</div>
			<!-- /wp:cover -->

		</div>
		<!-- /wp:column -->

	</div>
	<!-- /wp:columns -->

</section>
<!-- /wp:group -->
