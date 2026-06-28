<Page>
	<Container
		tagName="footer"
		align="full"
		className="demo-footer is-dark"
		layoutType="constrained"
	>
		<Container align="wide" className="demo-footer__top">
			<Columns className="demo-footer__top-columns" verticalAlignment="center">
				<Column className="demo-footer__brand" width="25%">
					<Pattern slug="guty-demo/logo-mark-light" />
				</Column>

				<Column className="demo-footer__tagline-col" width="35%">
					<Paragraph className="demo-footer__tagline">Templates built to look sharp, move fast, and convert.</Paragraph>
				</Column>

				<Column className="demo-footer__subscribe" width="40%">
					<Paragraph fontSize="xs">Subscribe to get updates, fresh releases, and coupon codes straight to your inbox.</Paragraph>
					<Block name="demo-blocks/brevo-form" listId="3" />
				</Column>
			</Columns>
		</Container>

		<Container align="wide" className="demo-footer__nav">
			<Container className="demo-footer__col">
				<Heading className="demo-footer__head">Navigate</Heading>
				<List className="demo-footer__links">
					<ListItem><Link href="/">Home</Link></ListItem>
					<ListItem><Link href="/examples">All Examples</Link></ListItem>
					<ListItem><Link href="/featured-examples">Example Collections</Link></ListItem>
					<ListItem><Link href="/services">Services</Link></ListItem>
					<ListItem><Link href="/about">About</Link></ListItem>
					<ListItem><Link href="/contact">Contact</Link></ListItem>
				</List>
			</Container>

			<Container className="demo-footer__col">
				<Heading className="demo-footer__head">Support</Heading>
				<List className="demo-footer__links">
					<ListItem><Link href="/help-center">Help Center</Link></ListItem>
					<ListItem><Link href="https://docs.example.test/">Knowledge Base</Link></ListItem>
				</List>
			</Container>

			<Container className="demo-footer__col">
				<Heading className="demo-footer__head">Socials</Heading>
				<List className="demo-footer__links">
					<ListItem><Link href="https://example.com/social" rel="noopener" target="_blank">Facebook</Link></ListItem>
					<ListItem><Link href="https://example.com/gallery" rel="noopener" target="_blank">Instagram</Link></ListItem>
				</List>
			</Container>

			<Container className="demo-footer__col">
				<Heading className="demo-footer__head">Say Hello</Heading>
				<List className="demo-footer__links">
					<ListItem><Link href="mailto:hello@example.test">hello@example.test</Link></ListItem>
				</List>
			</Container>
		</Container>

		<Container
			align="wide"
			className="demo-footer__base"
			layoutType="flex"
			layoutJustifyContent="space-between"
			layoutFlexWrap="wrap"
		>
			<Paragraph className="demo-footer__copy">© 2026 Example Studio</Paragraph>
			<Paragraph className="demo-footer__legal">{`<a href="/privacy-policy">Privacy Policy</a> &bull; <a href="/cookie-policy-eu">Cookie Policy</a>`}</Paragraph>
		</Container>
	</Container>
</Page>
