<Page>
	<Container
		tagName="footer"
		align="full"
		className="wolf-footer is-dark"
		layoutType="constrained"
	>
		<Container align="wide" className="wolf-footer__top">
			<Columns className="wolf-footer__top-columns" verticalAlignment="center">
				<Column className="wolf-footer__brand" width="25%">
					<Pattern slug="seijaku-fse/logo-mark-light" />
				</Column>

				<Column className="wolf-footer__tagline-col" width="35%">
					<Paragraph className="wolf-footer__tagline">Themes built to look sharp, move fast, and convert.</Paragraph>
				</Column>

				<Column className="wolf-footer__subscribe" width="40%">
					<Paragraph fontSize="xs">Subscribe to get updates, fresh releases, and coupon codes straight to your inbox.</Paragraph>
					<Block name="wolf-blocks/brevo-form" listId="3" />
				</Column>
			</Columns>
		</Container>

		<Container align="wide" className="wolf-footer__nav">
			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Navigate</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="/">Home</Link></ListItem>
					<ListItem><Link href="/wordpress-themes">All Themes</Link></ListItem>
					<ListItem><Link href="/music-wordpress-themes">Music Themes</Link></ListItem>
					<ListItem><Link href="/services">Services</Link></ListItem>
					<ListItem><Link href="/about">About</Link></ListItem>
					<ListItem><Link href="/contact">Contact</Link></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Support</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="/help-center">Help Center</Link></ListItem>
					<ListItem><Link href="https://wiki.wolfthemes.com/">Knowledge Base</Link></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Socials</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="https://facebook.com/wolfthemes" rel="noopener" target="_blank">Facebook</Link></ListItem>
					<ListItem><Link href="https://instagram.com/wolfthemes" rel="noopener" target="_blank">Instagram</Link></ListItem>
				</List>
			</Container>

			<Container className="wolf-footer__col">
				<Heading className="wolf-footer__head">Say Hello</Heading>
				<List className="wolf-footer__links">
					<ListItem><Link href="mailto:hello@wolfthemes.com">hello@wolfthemes.com</Link></ListItem>
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
