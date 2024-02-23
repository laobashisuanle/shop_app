<template>
	<view>
		<!-- 轮播图区域 输入uswiper可快速生成 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->

		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i">
				<image :src="item.image_src" class="nav-image" @click=navClickHandler(item)></image>
			</view>
		</view>

		<!-- 楼层区域 -->

		<view class="floor-list">

			<!-- 楼层item项 -->

			<view class="floor-item" v-for="(item,i) in floorList" :key="i">

				<!-- floor-title区域 -->

					<image :src="item.floor_title.image_src" class="floor-title"></image>

				<!-- product-list区域 -->
				
				<view class="product-list">
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix" :style="{width:item.product_list[0].image_width+'rpx'}" class="left-image"></image>
					</navigator>
					<view class="right-img-box">
						<navigator class="right-img-item" :url="item1.url" v-for="(item1,i1) in item.product_list" :key="i1" v-if="i1!=0">
							<image :src="item1.image_src" mode="widthFix" :style="{width:item1.image_width+'rpx'}"></image>
						</navigator>
					</view>
					
				</view>
				
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//轮播图数据
				swiperList: [],

				//分类导航的数据列表
				navList: [],

				//楼层区域
				floorList: []

			};
		},

		methods: {
			async getSwiperList() {

				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (res.meta.status != 200) return uni.$showMsg()

				this.swiperList = res.message

			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status != 200) return uni.$showMsg()

				this.navList = res.message
			},
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status != 200) return uni.$showMsg()
                //处理数据
				res.message.forEach(floor=>{
					floor.product_list.forEach(prod=>{
						prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url
					})
				})
				this.floorList = res.message
			},
			navClickHandler(item) {
				if (item.name == '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			}
		},
		onLoad() {

			this.getSwiperList(),
				this.getNavList(),
				this.getFloorList()
		},
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		padding: 15rpx 0;

		.nav-image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		width: 100%;
		height: 60rpx;
	}
	.right-img-box{
		display: flex;
		flex-wrap: wrap;
	    justify-content: space-around;
	}
	.product-list{
		display: flex;
		padding-left: 15rpx;
	}

</style>