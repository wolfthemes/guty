<Page>
	<Header slug="header" />
	<Main className="wolf-section-pad--big" layoutType="constrained">
		<Container align="wide" layoutType="constrained" layoutContentSize="40rem">
			<Container style={{ spacing: { blockGap: "var:preset|spacing|5" } }} layoutType="constrained">
				<Heading level={1} style={{ typography: { textAlign: "center" } }} fontSize="hero">404</Heading>
				<Paragraph style={{ typography: { textAlign: "center" } }} fontSize="base">{`Looks like this page missed the cue.<br>Let's get you back to the main stage.`}</Paragraph>
				<Buttons layoutType="flex" layoutJustifyContent="center">
					<Button url="/">Back to home</Button>
				</Buttons>
			</Container>
		</Container>
	</Main>
	<Footer slug="footer" />
</Page>
