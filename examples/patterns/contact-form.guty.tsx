// @guty pattern
// title: Contact Form
// slug: seijaku-fse/contact-form
// categories: contact, text
// description: A narrow placeholder section for a contact form shortcode.
// package: SeijakuFSE

<Page>
	<Section
		anchor="contact-form"
		metadata={{ name: "Contact form" }}
		align="full"
		className="wolf-section-pad--big"
		layoutType="constrained"
		layoutContentSize="760px"
	>
		<Heading level={2} textAlign="center">Send a message</Heading>
		<Paragraph textAlign="center">Replace the placeholder below with your active contact form shortcode.</Paragraph>
		<Shortcode>{`[contact-form-7 id="CONTACT_FORM_ID"]`}</Shortcode>
	</Section>
</Page>
