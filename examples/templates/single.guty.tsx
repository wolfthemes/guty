<Page>
	<Header slug="header" />
	<Main className="wolf-section-pad--big" layoutType="constrained">
		<Container align="wide" layoutType="constrained" layoutContentSize="44rem">
			<Container style={{ spacing: { blockGap: "var:preset|spacing|5" } }} layoutType="constrained">
				<PostDate fontSize="xs" />
				<PostTitle level={1} fontSize="3-xl" />
				<PostFeaturedImage isLink={false} />
				<PostContent layoutType="constrained" />
			</Container>
		</Container>
	</Main>
	<Footer slug="footer" />
</Page>
