<template>
	<view class="face">
		<vertify-mpsdk ref="verifyMpsdk"></vertify-mpsdk>
	</view>
</template>

<script>
	import vertifyMpsdk from '@/wxcomponents/verify_mpsdk/index/index';
	export default {
		components:{
			vertifyMpsdk
		},
		data() {
			return {

			}
		},
		onLoad(i) {
			// 页面onLoad的时候手动调用
			this.$nextTick(() => {
				this.$refs.verifyMpsdk.onLoad(i)
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>
