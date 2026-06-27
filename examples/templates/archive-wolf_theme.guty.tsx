<Page>
	<Header slug="header" />
	<Main layoutType="default">
		<Section className="wolf-archive-header wolf-section-pad--small" align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<QueryTitle type="archive" />
			<Paragraph>{`Fast, beautiful, and built to last.<br>WordPress themes for musicians, artists,<br>and the brands they're building.`}</Paragraph>
		</Section>
		<Section className="wolf-grid" align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">
			<Block name="wolf-store/theme-index" perPage={12} pagination="load_more" orderby="date" order="DESC" sidebar={true} />
		</Section>
	</Main>
	<Footer slug="footer" />
</Page>
