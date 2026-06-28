<Page>
	<Container
		tagName="header"
		align="full"
		className="site-header"
		layoutType="constrained"
	>
		<Container
			align="wide"
			className="site-header__inner"
			layoutType="flex"
			layoutJustifyContent="space-between"
			layoutFlexWrap="nowrap"
		>
			<SiteLogo width={120} isLink />
			<Navigation overlayMenu="mobile" className="site-nav">
				<NavigationLink label="Home" url="/" />
				<NavigationLink label="Work" url="/work" />
				<NavigationLink label="About" url="/about" />
				<Button className="site-header__cta" url="/contact">Contact</Button>
			</Navigation>
		</Container>
	</Container>
</Page>
