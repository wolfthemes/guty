// @guty pattern
// title: Contact Options
// slug: seijaku-fse/contact-options
// categories: contact, columns
// description: Clear contact paths for services, questions, support, and general requests.
// package: SeijakuFSE

<Page>
	<Section
		align="full"
		backgroundColor="base-2"
		className="wolf-contact-options wolf-section-pad--big"
		layoutType="constrained"
		layoutContentSize="var(--wp--style--global--wide-size)"
	>
		<Columns>
			<Column>
				<Heading level={2} fontSize="lg">Custom Services</Heading>
				<Paragraph>For installation, setup, optimization, and custom website help.</Paragraph>
				<Buttons mb={6}>
					<Button className="is-style-text" url="/services">View services</Button>
				</Buttons>
			</Column>
			<Column>
				<Heading level={2} fontSize="lg">Presale Questions</Heading>
				<Paragraph>Ask about theme features, compatibility, licensing, or choosing the right theme.</Paragraph>
				<Buttons mb={6}>
					<Button className="is-style-text" url="#contact-form">Ask a question</Button>
				</Buttons>
			</Column>
		</Columns>

		<Columns>
			<Column>
				<Heading level={2} fontSize="lg">Theme Support</Heading>
				<Paragraph>For help with an existing WolfThemes product, include your theme name and purchase details.</Paragraph>
				<Buttons mb={6}>
					<Button className="is-style-text" url="#contact-form">Request support</Button>
				</Buttons>
			</Column>
			<Column>
				<Heading level={2} fontSize="lg">General Requests</Heading>
				<Paragraph>For partnerships, account questions, or anything that does not fit the other categories.</Paragraph>
				<Buttons mb={6}>
					<Button className="is-style-text" url="#contact-form">Send message</Button>
				</Buttons>
			</Column>
		</Columns>
	</Section>
</Page>
