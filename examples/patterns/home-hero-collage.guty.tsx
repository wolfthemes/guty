// @guty pattern
// title: Hero — Collage
// slug: guty-demo/home-hero-collage
// categories: hero
// package: GutyDemo

<Page>
	<Section
		align="full"
		className="demo-hero demo-hero-collage is-dark has-texture"
		style={{ dimensions: { minHeight: "80vh" } }}
		layoutType="default"
	>
		<Container className="demo-hero-collage__inner" layoutType="default">
			<Container className="demo-hero-collage__content" layoutType="constrained">
				<Paragraph textAlign="center" className="demo-hero-dark__eyebrow demo-hero-collage__text-line">Designed by an independent studio. Trusted by 2,400+ projects in active development.</Paragraph>
				<Heading level={1} textAlign="center" className="demo-hero-dark__title">{`<span class="demo-hero-collage__text-line">Example Pages</span>\n\t\t\t\t<span class="demo-hero-collage__text-line">For Creators</span>`}</Heading>
				<Buttons layoutType="flex" layoutJustifyContent="center">
					<Button className="demo-btn-lg" url="/examples">View Examples</Button>
				</Buttons>
			</Container>

			<Container className="demo-hero-collage__stage" layoutType="default">
				<Container className="demo-hero-collage__thumbs" layoutType="default">
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--1">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--1"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/aurenza.jpg' ); ?>" alt="Preview one"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--2">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--2"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/gaintab.jpg' ); ?>" alt="Preview two"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--3">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--3"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/poize.jpg' ); ?>" alt="Preview three"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--4">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--4"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/sable.jpg' ); ?>" alt="Preview four"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--5">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--5"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/soundkraft.jpg' ); ?>" alt="Preview five"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--6">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--6"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/decibel.jpg' ); ?>" alt="Preview six"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--7">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--7"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/hares.jpg' ); ?>" alt="Preview seven"/></figure>`}</Image>
					<Image className="demo-hero-collage__thumb demo-hero-collage__thumb--8">{`<figure class="wp-block-image demo-hero-collage__thumb demo-hero-collage__thumb--8"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/home-collage/mediafoundry.jpg' ); ?>" alt="Preview eight"/></figure>`}</Image>
				</Container>
			</Container>
		</Container>
	</Section>
</Page>
