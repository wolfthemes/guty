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
					<ListItem><Link href="/" text="Home" /></ListItem>
					<ListItem><Link href="/wordpress-themes" text="All Themes" /></ListItem>
					<ListItem><Link href="/music-wordpress-themes" text="Music Themes" /></ListItem>
					<ListItem><Link href="/services" text="Services" /></ListItem>
					<ListItem><Link href="/about" text="About" /></ListItem>
					<ListItem><Link href="/contact" text="Contact" /></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Support</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="/help-center" text="Help Center" /></ListItem>
					<ListItem><Link href="https://wiki.wolfthemes.com/" text="Knowledge Base" /></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Socials</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="https://facebook.com/wolfthemes" text="Facebook" rel="noopener" target="_blank" /></ListItem>
					<ListItem><Link href="https://instagram.com/wolfthemes" text="Instagram" rel="noopener" target="_blank" /></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Say Hello</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="mailto:hello@wolfthemes.com" text="hello@wolfthemes.com" /></ListItem>
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
