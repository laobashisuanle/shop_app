<template>
<view class="goods-item">
					<!-- 左侧照片区域 -->
					<view class="goods-item-left">
						<image :src="goods.goods_small_logo || defultPic"></image>
					</view>
					<!-- 右侧文本区域 -->
					<view class="goods-item-right">

						<text class="goods-item-right-title">{{goods.goods_name}}</text>
						<view class="goods-item-right-info">
							<text class="price">￥{{goods.goods_price | toFixed}}</text>
						</view>
					</view>
				</view>
</template>

<script>
	export default {
		name:"my-goods",
		props:{
			goods:{
				type:Object,
				defult:{}
			}
		},
		data() {
			return {
				defultPic:'/static/defultPic.jpg'
			};
		},
		filters:{
			//过滤器处理小数点后两位
			toFixed(num){
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
   .goods-item{
	   display: flex;
	   padding:5px 10px;
	   border-bottom: 1px solid #efefef;
	   .goods-item-left{
		   margin-right: 10px;
		   image{
			   width: 100px;
			   height: 100px;
		   }
	   }
	   .goods-item-right{
		   display: flex;
		   flex-direction: column;
		   justify-content: space-between;
		   .goods-item-right-title{
			   font-size: 14px;
		   }
		   .goods-item-right-info{
			   .price{
				   color: #C00000;
				   font-size: 20px;
			   }
		   }
	   }
   }
</style>