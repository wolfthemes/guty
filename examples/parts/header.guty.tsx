<Page>
	<Pattern slug="seijaku-fse/sale-marquee" />
	<Header className="wolf-header" align="full">
		<Container
			className="wolf-header__inner"
			align="wide"
			layout={{ type: "flex", justifyContent: "space-between", flexWrap: "nowrap" }}
		>
			<Pattern slug="seijaku-fse/logo-mark-dark" />
			<Navigation
				overlayMenu="mobile"
				className="wolf-nav"
				layout={{ type: "flex", justifyContent: "right", flexWrap: "wrap" }}
			>
				<NavigationLink label="Home" url="/" />
				<NavigationLink label="Store" url="/wordpress-themes" />
				<NavigationLink label="Services" url="/services" />
				<NavigationLink label="Contact" url="/contact" />
				<Button className="wolf-header__cta wolf-header__cta--drawer" url="/wordpress-themes">
					Browse Themes
				</Button>
			</Navigation>
			<Button className="wolf-header__cta" url="/wordpress-themes">
				Browse Themes
			</Button>
		</Container>
	</Header>
</Page>
