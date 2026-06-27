<?php
/**
 * Title: About Intro
 * Slug: seijaku-fse/about-intro
 * Categories: about, text
 * Description: A minimal personal introduction for the About page.
 *
 * @package SeijakuFSE
 */

?>
<!-- wp:group {"tagName":"section","align":"full","className":"wolf-section-pad--small","layout":{"type":"constrained","contentSize":"720px"}} -->
<section class="wp-block-group alignfull wolf-section-pad--small">

	<!-- wp:image {"width":"120px","height":"120px","scale":"cover","sizeSlug":"thumbnail","linkDestination":"none","align":"center","style":{"border":{"radius":"999px"}}} -->
	<figure class="wp-block-image aligncenter size-thumbnail is-resized has-custom-border"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/me.jpg' ); ?>" alt="Constantin Saguin, founder of WolfThemes" width="180" height="180" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>
	<!-- /wp:image -->

	<!-- wp:heading {"textAlign":"center","level":1,"fontSize":"hero"} -->
	<h1 class="wp-block-heading has-text-align-center has-hero-font-size">Hi there,</h1>
	<!-- /wp:heading -->

	<!-- wp:paragraph {"align":"center","fontSize":"md"} -->
	<p class="has-text-align-center has-md-font-size">I'm Constantin, the founder of WolfThemes. I design and build WordPress themes for creative people who need a site that looks sharp, works reliably, and stays easy to manage.</p>
	<!-- /wp:paragraph -->

</section>
<!-- /wp:group -->
