<template>
	<view>
		<my-search @click="goToSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滚动区域 -->
			<scroll-view scroll-y="true" :style="{height:wh+'px'}" class="left-scroll-view">
				<block v-for="(item,i) in cateList" :key="i">
					<view :class="['left-scroll-view-item',i===active?'active':'']" @click="activeChange(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>

			<!-- 右侧滚动区域 -->
			<scroll-view scroll-y="true" :style="{height:wh+'px'}" class="right-scroll-view" :scroll-top="scrollTop">
				<view class="right-scroll-view-item" v-for="(item2,i2) in cateLevel2" :key="i2">
					<view class="cateLevel2">/ {{item2.cat_name}} /</view>
					<view class="cateLevel3-list">
						<view class="cateLevel3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="cateClickHandler(item3)">
							<image class="cateLevel3-pic" :src="item3.cat_icon.replace('dev','web')" mode="widthFix" />
							<text class="cateLevel3-text">{{item3.cat_name}}</text>
						</view>
					</view>
				</view>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins:[badgeMix],
		data() {
			return {
				wh: 0,
				cateList: [],
				active: 0,
				cateLevel2: [],
				scrollTop:0
			}
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status != 200) return uni.$showMsg()

				this.cateList = res.message
				this.cateLevel2 = this.cateList[0].children
			},
			activeChange(i) {
				this.active = i,
					this.cateLevel2 = this.cateList[i].children
                 this.scrollTop = this.scrollTop ===0?1:0
			},
			cateClickHandler(item3){
				uni.navigateTo({
                url:'/subpkg/goods_list/goods_list?cid='+item3.cat_id
				})
			},
			goToSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight-50,
				this.getCateList()
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		background-color: white;
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				background-color: #F7F7F7;
				line-height: 60px;
				font-size: 12px;
				text-align: center;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&:before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						position: absolute;
						top: 25%;
						left: 0;
						background-color: #C00000;
					}
				}
			}

		}
	}


	.cateLevel2 {

		text-align: center;
		font-weight: bold;
		font-size: 12px;
		padding: 15px 0;
		
	}

	.cateLevel3-list {
		display: flex;
		flex-wrap: wrap;
		.cateLevel3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		   margin-bottom: 10px;
			image {
				width: 60px;
				height: 60px;
			}

			text {}
		}
	}
</style>