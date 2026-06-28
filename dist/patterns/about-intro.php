<?php
/**
 * Title: About Intro
 * Slug: guty-demo/about-intro
 * Description: A minimal personal introduction for the About page.
 * Categories: about, text
 *
 * @package GutyDemo
 */

?>

<!-- wp:group {"tagName":"section","className":"demo-section-pad\u002d\u002dsmall","align":"full","layout":{"type":"constrained","contentSize":"720px"}} -->
<section class="wp-block-group alignfull demo-section-pad--small">
	<!-- wp:image {"align":"center","scale":"cover","sizeSlug":"thumbnail","linkDestination":"none","style":{"border":{"radius":"999px"}},"width":"120px","height":"120px"} -->
	<figure class="wp-block-image aligncenter size-thumbnail is-resized has-custom-border"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/me.jpg' ); ?>" alt="Jordan Example, maintainer of Example Studio" width="180" height="180" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>
	<!-- /wp:image -->
	<!-- wp:heading {"level":1,"textAlign":"center","fontSize":"hero"} -->
	<h1 class="wp-block-heading has-text-align-center has-hero-font-size">Hi there,</h1>
	<!-- /wp:heading -->
	<!-- wp:paragraph {"align":"center","fontSize":"md"} -->
	<p class="has-text-align-center has-md-font-size">I'm Jordan, the maintainer of this demo site. These examples show how Guty structures pages for people who need a site that looks sharp, works reliably, and stays easy to manage.</p>
	<!-- /wp:paragraph -->
</section>
<!-- /wp:group -->
