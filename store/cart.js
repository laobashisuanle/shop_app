export default {
	namespaced: true,


	state: () => ({
		cart:JSON.parse( uni.getStorageSync('cart')||'[]')
	}),


	mutations: {
		addToCart(state,goods){
			const findResult = state.cart.find(x=>x.goods_id===goods.goods_id)
			if(!findResult){
				//即cart中无该商品
				state.cart.push(goods)
			}else{
				//已存在该商品，数量加1
				findResult.goods_count++
			}
			
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		}
	},

	getters: {
		total(state){
			let c =0
			state.cart.forEach(x=>c+=x.goods_count)
			return c
		}
	},

}