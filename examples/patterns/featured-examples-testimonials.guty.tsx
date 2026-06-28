// @guty pattern
// title: Example Collections Testimonials
// slug: guty-demo/featured-examples-testimonials
// categories: testimonials
// package: GutyDemo

<Page>
	<Section
		className="demo-testimonials demo-featured-examples-testimonials demo-section-pad"
		align="full"
		pt={10}
		pb={10}
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Heading level={2} textAlign="center" className="demo-section-title">Raising the Bar of Example Collections Quality Since 2011</Heading>
		<Paragraph textAlign="center" className="demo-section-subtitle demo-tagline">Trusted by demo customers</Paragraph>
		<Columns className="demo-testimonials__grid">
			<Column>
				<Block name="demo-blocks/testimonial-card" content="Great example can do a lot with, got plenty of features and is easy to configure. Support is great. I had some problems as a WordPress newbie but support solved everything." name_="kontakt952" authorTitle="Demo Alpha" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content="The overall look and usability of this example is great, but the documentation and customer support is what sets it apart. Really helpful resources and great support." name_="joergrappl" authorTitle="Demo Beta" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content="A solid example for my media company website. I had a small issue and support was quick to fix it. It makes the addition of events simple and looks great out of the box." name_="themuskrat33" authorTitle="Demo Gamma" rating={5} />
			</Column>
			<Column>
				<Block name="demo-blocks/testimonial-card" content="Love this example. It is beautifully designed, easy to use, and the customer support is great." name_="chrissa007" authorTitle="Demo Delta" rating={5} />
			</Column>
		</Columns>
	</Section>
</Page>
