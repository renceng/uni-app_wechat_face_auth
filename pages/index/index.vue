<template>
	<view class="content">
		<button type="primary" @tap="gotoVerify">进入人脸核身</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				BizToken: 'D2040794-F7D4-4937-9D4D-22E65B4A9C16'
			}
		},
		onLoad() {
			const Verify = require('@/wxcomponents/verify_mpsdk/main.js')
			Verify.init()
		},
		methods: {
			gotoVerify() {
				this.BizToken = '5CDFF7A7-F92C-4556-97FD-CB07A62BD22B' // 这里需要我们去客户后端调用DetectAuth接口获取BizToken
				// 调用实名核身功能
				wx.startVerify({
					data: { 
						token: this.BizToken // BizToken
					},
					success: (res) => { // 验证成功后触发
						// res 包含验证成功的token, 这里需要加500ms延时，防止iOS下不执行后面的逻辑
						setTimeout(() => {
							// 验证成功后，拿到token后的逻辑处理，具体以客户自身逻辑为准
							console.log(res)
						}, 500)
					},
					fail: (err) => { // 验证失败时触发
						// err 包含错误码，错误信息，弹窗提示错误
						setTimeout(() => {
							console.log(err)
							wx.showModal({
								title: "提示",
								content: err.ErrorMsg,
								showCancel: false
							})
						}, 500)
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px 0px 40px 0px;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
