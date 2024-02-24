<template>
	<view>
		<view class="my-search-box" @click="handleClick">
			<view class="my-search-put">
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		methods:{
			handleClick(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
    .my-search-box{
		height: 50px;
		background-color: #C00000;
		padding: 0 10px;
		display: flex;
		align-items: center;
		.my-search-put{
			background-color: white;
			height: 36px;
			border-radius: 18px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.placeholder{
				font-size:16px;
				margin-left: 4px;
			}
		}
	}
</style>