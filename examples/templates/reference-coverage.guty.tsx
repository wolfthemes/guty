export default (
  <Page>
    <Header slug="header" />

    <Main layoutType="default">
      <Cover
        url="<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero-services.jpg' ); ?>"
        dimRatio={40}
        minHeight={72}
        minHeightUnit="vh"
        align="full"
        className="demo-services--hero is-dark has-texture"
        pt={10}
        pb={9}
      >
        <Container layoutType="constrained" layoutContentSize="920px">
          <Paragraph className="demo-eyebrow">Reference coverage</Paragraph>
          <Heading level={1} textAlign="center" fontSize="hero">
            Gutenberg output coverage
          </Heading>
          <Paragraph textAlign="center" fontSize="md">
            This source exercises the reference-backed Guty syntax.
          </Paragraph>
          <Buttons className="demo-btn-lg" layoutType="flex" layoutJustifyContent="center">
            <Button url="/services">Start a Project</Button>
          </Buttons>
        </Container>
      </Cover>

      <Container
        tagName="section"
        anchor="reference-grid"
        align="full"
        backgroundColor="base-2"
        className="demo-section-pad--big"
        metadata={{ name: "Reference Grid" }}
        layoutType="constrained"
        layoutContentSize="var(--wp--style--global--wide-size)"
      >
        <Columns verticalAlignment="center" style={{ spacing: { blockGap: { left: "var:preset|spacing|8" } } }}>
          <Column width="60%" className="demo-reference__main" layoutType="default">
            <Image
              width="120px"
              height="120px"
              scale="cover"
              sizeSlug="thumbnail"
              linkDestination="none"
              align="center"
              style={{ border: { radius: "999px" } }}
            >
              {`<figure class="wp-block-image aligncenter size-thumbnail is-resized has-custom-border"><img src="<?php echo esc_url( get_theme_file_uri() . '/assets/images/me.jpg' ); ?>" alt="Reference portrait" width="180" height="180" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>`}
            </Image>

            <List className="demo-reference-list">
              <ListItem>Example parts</ListItem>
              <ListItem>Query loops</ListItem>
              <ListItem>Raw custom block markup</ListItem>
            </List>

            <Details summary="What does this cover?">
              <Paragraph>
                Core layout, media, text, query, shortcode, HTML, and generic custom blocks.
              </Paragraph>
            </Details>
          </Column>

          <Column width="40%">
            <Spacer height="var:preset|spacing|5" />
            <Html>{`<div class="demo-reference-html"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></div>`}</Html>
            <Shortcode>{`[contact-form-7 id="CONTACT_FORM_ID"]`}</Shortcode>
          </Column>
        </Columns>
      </Container>

      <Query
        queryId={0}
        query={{
          perPage: 10,
          pages: 0,
          offset: 0,
          postType: "post",
          order: "desc",
          orderBy: "date",
          author: "",
          search: "",
          exclude: [],
          sticky: "",
          inherit: true,
        }}
        layoutType="constrained"
      >
        <PostTemplate style={{ spacing: { blockGap: "var:preset|spacing|7" } }} layoutType="constrained">
          <PostDate fontSize="xs" />
          <PostTitle isLink fontSize="2-xl" />
          <PostExcerpt moreText="Read more" excerptLength={28} />
        </PostTemplate>
        <QueryPagination layoutType="flex" layoutJustifyContent="space-between">
          <QueryPaginationPrevious />
          <QueryPaginationNext />
        </QueryPagination>
        <QueryNoResults>
          <Paragraph textAlign="center">No posts found.</Paragraph>
        </QueryNoResults>
      </Query>

      <QueryTitle type="archive" textAlign="center" fontSize="3-xl" />
      <PostFeaturedImage isLink={false} />
      <PostContent layoutType="constrained" />

      <Block
        name="demo-store/example-index"
        perPage={12}
        theme_cat="featured"
        pagination="none"
        orderby="featured"
        order="DESC"
        cardHeading="h3"
        sidebar={true}
      />

      <Block
        name="demo-blocks/marquee"
        text={` Example Studio <span class="demo-blocks-marquee__item-separator">✦</span> Example Project Pages `}
        direction="left"
        animationDuration={30}
        mt={0}
      >
        {`<div class="wp-block-demo-blocks-marquee"><div class="demo-blocks-marquee__track"><span>Example Studio</span></div></div>`}
      </Block>

      <Block name="demo-blocks/brevo-form" listId={12345}>
        {`<div class="wp-block-demo-blocks-brevo-form" data-list-id="12345"></div>`}
      </Block>

      <Block name="demo-blocks/stats-counter" title="Items Sold" endNumber={35} suffix="k">
        {`<div class="wp-block-demo-blocks-stats-counter"><strong>2.4k</strong><span>Items Sold</span></div>`}
      </Block>
    </Main>

    <Footer slug="footer" />
  </Page>
);
