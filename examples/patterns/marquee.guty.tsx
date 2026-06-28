// @guty pattern
// title: Marquee
// slug: guty-demo/marquee
// categories: banner
// package: GutyDemo

export default (
	<Page>
		<Block
			name="demo-blocks/marquee"
			text={` Example Studio <span class="demo-blocks-marquee__item-separator">✦</span> Example Project Pages <span class="demo-blocks-marquee__item-separator">✦</span> `}
			direction="left"
			animationDuration={30}
			mt="0"
		/>
	</Page>
);
