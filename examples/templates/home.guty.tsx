<Page>
	<Header slug="header" />
	<Main layoutType="default">
		<Section className="wolf-section-pad--big" layoutType="constrained" layoutContentSize="48rem">
			<QueryTitle type="archive" textAlign="center" fontSize="3-xl" />
			<Paragraph textAlign="center" fontSize="base">Notes, updates, and articles from WolfThemes.</Paragraph>
			<Query
				queryId={0}
				query={{ perPage: 10, pages: 0, offset: 0, postType: "post", order: "desc", orderBy: "date", author: "", search: "", exclude: [], sticky: "", inherit: true }}
				layoutType="constrained"
			>
				<PostTemplate style={{ spacing: { blockGap: "var:preset|spacing|7" } }} layoutType="constrained">
					<Container style={{ spacing: { blockGap: "var:preset|spacing|3" } }} layoutType="constrained">
						<PostDate fontSize="xs" />
						<PostTitle isLink={true} fontSize="2-xl" />
						<PostExcerpt moreText="Read more" excerptLength={28} />
					</Container>
				</PostTemplate>
				<QueryPagination layoutType="flex" layoutJustifyContent="space-between">
					<QueryPaginationPrevious />
					<QueryPaginationNext />
				</QueryPagination>
				<QueryNoResults>
					<Paragraph textAlign="center">No posts found.</Paragraph>
				</QueryNoResults>
			</Query>
		</Section>
	</Main>
	<Footer slug="footer" />
</Page>
