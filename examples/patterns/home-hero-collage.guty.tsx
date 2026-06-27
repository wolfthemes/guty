// @guty pattern
// title: Hero — Collage
// slug: seijaku-fse/home-hero-collage
// categories: hero
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		className="wolf-hero wolf-hero-collage is-dark has-texture"
		style={{ dimensions: { minHeight: "80vh" } }}
		layoutType="default"
	>
		<Container className="wolf-hero-collage__inner" layoutType="default">
			<Container className="wolf-hero-collage__content" layoutType="constrained">
				<Paragraph textAlign="center" className="wolf-hero-dark__eyebrow wolf-hero-collage__text-line">Designed by an independent studio. Trusted by 36,000+ customers since 2011.</Paragraph>
				<Heading level={1} textAlign="center" className="wolf-hero-dark__title">{`<span class="wolf-hero-collage__text-line">WordPress Themes</span>\n\t\t\t\t<span class="wolf-hero-collage__text-line">For Creators</span>`}</Heading>
				<Buttons layoutType="flex" layoutJustifyContent="center">
					<Button className="wolf-btn-lg" url="/wordpress-themes">Browse Themes</Button>
				</Buttons>
			</Container>

			<Container className="wolf-hero-collage__stage" layoutType="default">
				<Container className="wolf-hero-collage__thumbs" layoutType="default">
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--1">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--1"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/aurenza.jpg' ); ?>" alt="Aurenza theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--2">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--2"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/gaintab.jpg' ); ?>" alt="Gaintab theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--3">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--3"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/poize.jpg' ); ?>" alt="Poize theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--4">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--4"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>" alt="Sable theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--5">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--5"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/soundkraft.jpg' ); ?>" alt="Soundkraft theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--6">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--6"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/decibel.jpg' ); ?>" alt="Decibel theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--7">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--7"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/hares.jpg' ); ?>" alt="Hares theme preview"/></figure>`}</Image>
					<Image className="wolf-hero-collage__thumb wolf-hero-collage__thumb--8">{`<figure class="wp-block-image wolf-hero-collage__thumb wolf-hero-collage__thumb--8"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>" alt="Media Foundry theme preview"/></figure>`}</Image>
				</Container>
			</Container>
		</Container>
	</Section>
</Page>
