<template>
	<view v-if="detailInfo.goods_name" class="fatherBox">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,i) in detailInfo.pics">
				<image :src="item.pics_big" @click="handleClick(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods_info">
			<!-- 商品价格 -->
			<view class="goods_price">￥{{detailInfo.goods_price}}</view>
			<!-- 商品主要信息 -->
			<view class="good_info">
				<view class="goods_name">{{detailInfo.goods_name}}</view>
				<view class="star">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<text class="trans">快递：免运费</text>
		</view>

		<rich-text :nodes="detailInfo.goods_introduce" class="rich-text"></rich-text>
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>

	</view>
</template>

<script>
	import { mapState,mapMutations,mapGetters } from 'vuex'
	
	export default {
		computed:{
			...mapState('m_cart',[]),
			...mapGetters('m_cart',['total'])
		},
		watch:{
			total:{
				handler(newVal){
					const findResult = this.options.find(x=> x.text==='购物车')
					if(findResult){
						findResult.info=newVal
					}
				},
				immediate:true
			}
			// total(newVal){
			// 	const findResult = this.options.find(x=>x.text==='购物车')
			// 	if(findResult){
			// 		findResult.info = newVal
			// 	}
			// }
		},
		data() {
			return {
				detailInfo: {},
				options: [{
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			};
		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getDetailInfo(goods_id)
		},
		methods: {
			...mapMutations('m_cart',['addToCart']),
			async getDetailInfo(goods_id) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})
				console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg()
				//用正则表达式对富文本进行修改
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style=" display:block;"').replace(/webp/g, 'jpg')
				this.detailInfo = res.message
			},
			//实现图片的点击预览效果
			handleClick(i) {
				uni.previewImage({
					current: i,
					urls: this.detailInfo.pics.map(x => x.pics_big)
				})
			},
			onClick(e){
				console.log(e)
				if(e.content.text==='购物车'){
					uni.switchTab({
						url:'/pages/cart/cart',
						
					})
					
				}
			},
			buttonClick(e){
				if(e.content.text==='加入购物车'){
					
					const goods ={
						goods_id:this.detailInfo.goods_id,
						goods_name:this.detailInfo.goods_name,
						goods_price:this.detailInfo.goods_price,
						goods_count:1,
						goods_small_logo:this.detailInfo.goods_small_logo,
						goods_state:true
					}
					this.addToCart(goods)
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.rich-text {
		margin-top: 20px;
	}

	.goods_info {
		.goods_price {
			color: #C00000;
			font-size: 18px;
			padding: 10px 5px;
		}

		.good_info {
			display: flex;

			.goods_name {
				font-size: 14px;
			}

			.star {
				width: 120px;
				color: gray;
				margin-left: 10px;
				padding-left: 5px;
				border-left: 1px solid #efefef;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.trans {
			font-size: 12px;
			color: gray;
			margin-top: 10px;
		}
	}
	.fatherBox{
		position: relative;
		padding-bottom: 50px;
		.goods_nav{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}

	
</style>