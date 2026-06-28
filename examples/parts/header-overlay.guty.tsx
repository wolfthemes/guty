<Page>
	<Pattern slug="guty-demo/sale-marquee" />
	<Container
		tagName="header"
		className="demo-header demo-header-overlay"
		align="full"
		layoutType="constrained"
	>
		<Container
			align="wide"
			className="demo-header__inner"
			layoutType="flex"
			layoutJustifyContent="space-between"
			layoutFlexWrap="nowrap"
		>
			<Pattern slug="guty-demo/logo-mark-light" />
			<Navigation
				overlayMenu="mobile"
				className="demo-nav"
				layoutType="flex"
				layoutJustifyContent="right"
				layoutFlexWrap="wrap"
			>
				<NavigationLink label="Home" url="/" />
				<NavigationLink label="Projects" url="/examples" />
				<NavigationLink label="Services" url="/services" />
				<NavigationLink label="Contact" url="/contact" />
				<Button className="demo-header__cta demo-header__cta--drawer" url="/examples">View Examples</Button>
			</Navigation>
			<Button className="demo-header__cta" url="/examples">View Examples</Button>
		</Container>
	</Container>
</Page>
