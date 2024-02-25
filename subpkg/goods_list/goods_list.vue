<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="goToDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					query: '',
					cid: '',
					pageNum: 1,
					pageSize: 10
				},
				goodsList: [],
				total: 0,
				//节流阀
				isLoading: false

			}
		},
		methods: {
			async getGoodsList(cb) {

				//打开节流阀
				this.isLoading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				//关闭节流阀
				this.isLoading = false
				//判断回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			goToDetail(goods) {
				console.log("ok")
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		onReachBottom() {

			if (this.queryObj.pageNum * this.queryObj.pageSize >= this.total) return uni.$showMsg('数据已加载完毕！')

			//判断是否需要获取数据
			if (this.isLoading) return

			this.pageNum++
			this.getGoodsList()
		},
		onPullDownRefresh() {
			//重置关键数据
			this.pageNum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []

			//重新发起请求
			this.getGoodsList(() => {
				uni.stopPullDownRefresh()
			})

		}
		

	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 5px 10px;
		border-bottom: 1px solid #efefef;

		.goods-item-left {
			margin-right: 10px;

			image {
				width: 100px;
				height: 100px;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-item-right-title {
				font-size: 14px;
			}

			.goods-item-right-info {
				.price {
					color: #C00000;
					font-size: 20px;
				}
			}
		}
	}
</style>