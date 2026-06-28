<Page>
	<Header slug="header" />
	<Main layoutType="default">
		<Section className="demo-archive-header demo-section-pad--small" align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<QueryTitle type="archive" />
			<Paragraph>{`Fast, beautiful, and built to last.<br>example pages for teams, creators,<br>and the brands they're building.`}</Paragraph>
		</Section>
		<Section className="demo-grid" align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<Block name="demo-store/example-index" perPage={12} pagination="load_more" orderby="date" order="DESC" sidebar={true} />
		</Section>
	</Main>
	<Footer slug="footer" />
</Page>
