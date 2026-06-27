<Page>
	<Pattern slug="seijaku-fse/sale-marquee" />
	<Container
		tagName="header"
		className="wolf-header wolf-header-overlay"
		align="full"
		layoutType="constrained"
	>
		<Container
			align="wide"
			className="wolf-header__inner"
			layoutType="flex"
			layoutJustifyContent="space-between"
			layoutFlexWrap="nowrap"
		>
			<Pattern slug="seijaku-fse/logo-mark-light" />
			<Navigation
				overlayMenu="mobile"
				className="wolf-nav"
				layoutType="flex"
				layoutJustifyContent="right"
				layoutFlexWrap="wrap"
			>
				<NavigationLink label="Home" url="/" />
				<NavigationLink label="Store" url="/wordpress-themes" />
				<NavigationLink label="Services" url="/services" />
				<NavigationLink label="Contact" url="/contact" />
				<Button className="wolf-header__cta wolf-header__cta--drawer" url="/wordpress-themes">Browse Themes</Button>
			</Navigation>
			<Button className="wolf-header__cta" url="/wordpress-themes">Browse Themes</Button>
		</Container>
	</Container>
</Page>
