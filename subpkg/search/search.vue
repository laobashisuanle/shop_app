<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" placeholder="请输入搜索内容" :radius="100" cancel-button="none"></uni-search-bar>
		</view>
		<!-- 搜索结果 -->
		<view class="search-list" v-if="searchList.length!==0">
			<view class="search-item" v-for="(item,i) in searchList" :key="i" @click="goToDetail(item)">
				<text class="goods-name">{{item.goods_name}}</text>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-else>
			<!-- 标题区域 -->
			<view class="search-history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
			</view>
			<!-- 内容区域 -->
			<view class="search-history-list">
				<uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="goToList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//防抖节流操作
				timer: null,
				kw: '',
				searchList: [],
				historyList: ['a', 'app', 'b']
			}
		},
		methods: {
			goToList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+item
				})
			},
			clearHistory(){
				this.historyList = []
				uni.setStorageSync('kw','[]')
			},
			input(e) {
				clearTimeout(this.timer)
				setTimeout(() => {
					this.kw = e
					this.getSearchList()
				}, 500)

			},
			async getSearchList() {
				if (this.kw == '') {
					this.searchList = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/publish/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.code !== 200) {
					return uni.$showMsg()
				}
				this.searchList = res.message

				this.saveSearchHistory()
			},
			goToDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			saveSearchHistory() {
				//搜索记录的去重
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				//存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			}
		},
		computed: {
			histories() {
				return [...this.historyList].reverse()
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
	.uni-search-bar {
		background-color: white;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.search-list {
		padding: 0 5px;

		.search-item {
			font-size: 12px;
			padding: 12px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.search-history {
		padding: 0 5px;

		.search-history-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 36px;
			border-bottom: 1px solid #efefef;

			.text {
				font-size: 12px;
			}
		}

		.search-history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>