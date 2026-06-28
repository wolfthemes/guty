// @guty pattern
// title: Testimonials
// slug: guty-demo/testimonials
// categories: testimonials
// package: GutyDemo

<Page>
	<Section
		className="demo-testimonials demo-section-pad"
		align="full"
		pt={11}
		pb={11}
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center" className="demo-section-title">Customer notes on the marketplace</Heading>
		<Columns className="demo-testimonials__grid">
			<Column>
				<Block name="demo-blocks/testimonial-card" content='"Great example can do a lot with, got plenty of features and is easy to configure. Support is great i had some problems as a WordPress newbie but support solved everything."' name_="kontakt952" authorTitle="Demo Alpha" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content='"The overall look and usability of this example is great, but the documentation and customer support is what sets it apart. Really helpful resources and great support!"' name_="joergrappl" authorTitle="Demo Beta" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content='"A solid example for my media company website – I had a small issue and support was quick to fix it. It makes the addition of events simple and looks great out of the box, on all mobile devices and my PC."' name_="themuskrat33" authorTitle="Demo Gamma" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content='"After 10 years of using the Demo Delta example, now I had to migrate to the latest version. The support was really excellent and made it work again, response within 24hrs. Recommended!"' name_="chrissa007" authorTitle="Demo Delta" rating={5} />
			</Column>
		</Columns>
	</Section>
</Page>
