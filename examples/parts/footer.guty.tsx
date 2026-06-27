<Page>
	<Container
		tagName="footer"
		align="full"
		className="wolf-footer is-dark"
		layoutType="constrained"
	>
		<Container align="wide" className="wolf-footer__top">
			<Pattern slug="seijaku-fse/logo-mark-light" />
			<Paragraph className="wolf-footer__tagline">Themes built to look sharp, move fast, and convert.</Paragraph>
			<Paragraph fontSize="xs">Subscribe to get updates, fresh releases, and coupon codes straight to your inbox.</Paragraph>
			<Block name="wolf-blocks/brevo-form" />
		</Container>

		<Container align="wide" className="wolf-footer__nav">
			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Navigate</Heading>
				<List className="wolf-footer__links">
					<ListItem>{`<a href="/">Home</a>`}</ListItem>
					<ListItem>{`<a href="/wordpress-themes">All Themes</a>`}</ListItem>
					<ListItem>{`<a href="/music-wordpress-themes">Music Themes</a>`}</ListItem>
					<ListItem>{`<a href="/services">Services</a>`}</ListItem>
					<ListItem>{`<a href="/about">About</a>`}</ListItem>
					<ListItem>{`<a href="/contact">Contact</a>`}</ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Support</Heading>
				<List className="wolf-footer__links">
					<ListItem>{`<a href="/help-center">Help Center</a>`}</ListItem>
					<ListItem>{`<a href="https://wiki.wolfthemes.com/">Knowledge Base</a>`}</ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Socials</Heading>
				<List className="wolf-footer__links">
					<ListItem>{`<a href="https://facebook.com/wolfthemes" rel="noopener" target="_blank">Facebook</a>`}</ListItem>
					<ListItem>{`<a href="https://instagram.com/wolfthemes" rel="noopener" target="_blank">Instagram</a>`}</ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Say Hello</Heading>
				<List className="wolf-footer__links">
					<ListItem>{`<a href="mailto:hello@wolfthemes.com">hello@wolfthemes.com</a>`}</ListItem>
				</List>
			</Container>
		</Container>

		<Container
			align="wide"
			className="wolf-footer__base"
			layoutType="flex"
			layoutJustifyContent="space-between"
			layoutFlexWrap="wrap"
		>
			<Paragraph className="wolf-footer__copy">© 2026 WolfThemes</Paragraph>
			<Paragraph className="wolf-footer__legal">{`<a href="/privacy-policy">Privacy Policy</a> &bull; <a href="/cookie-policy-eu">Cookie Policy</a>`}</Paragraph>
		</Container>
	</Container>
</Page>
