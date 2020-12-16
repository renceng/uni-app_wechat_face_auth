const regeneratorRuntime = require("../utils/regenerator-runtime/runtime"),
	util = require("../utils/util");
var sysFailInfo = require("../config").sysFailInfo,
	BASE_URL = "";
const main = require("../main");
var tokenExceptionArr = [14, 15],
	idExceptionArr = [2002, 2003, 2006],
	ctx = "";
Page({
	data: {
		curPage: 1,
		cmsConfig: {},
		skipConfig: {},
		bizData: {},
		token: "",
		preClickBtnTime: 0,
		isNotCamera: !0,
		iKnowFuncs: [],
		index_rule: !1,
		show_about_dlg: !1,
		indexChecked: !0,
		indexDisableBtn: !1,
		show_auth_panel: !1,
		authInfo: "",
		isInfinityDisplay: !1,
		notice: {
			titie: "",
			content: ""
		},
		sms: {
			isForbiddenSmsBtn: !0,
			hintError: "",
			isEnableSendSms: !1,
			is60sGap: !1,
			sendSmsTtitle: "获取验证码",
			gapSec: 60,
			phoneNum: "",
			verifyCode: ""
		},
		ocr: {
			isShowTakePhoto: !1,
			isShowResult: !1,
			isShowGuide: !0,
			isShowPhotoPreView: !1,
			isPhotoFromCamera: !1,
			isFrontIdCard: !0,
			hintError: "",
			hintErrorResult: "",
			isForbiddenManualBtn: !0,
			isForbiddenResultBtn: !1,
			idcard: "",
			idname: "",
			idaddress: "",
			tempImagePath: "",
			ocrTitle: "请拍摄身份证人像面",
			verifycamFullScreen: "verifycamFullScreen",
			isToolsShow: !0,
			isEditTheOcrIsManualInput: !1,
			isInfinityDisplayOcrTitle: "",
			isInfinityDisplayOcrBottom: "",
			isInfinityDisplayOcrMiddle: "",
			frontMediaKey: "",
			backendMediaKey: ""
		},
		livingbody: {
			isShowGuide: !0,
			isShowCamera: !1,
			isShowProcess: !1,
			isShowDialog: !1,
			livingbodyNumber: "",
			isNotPrepareOk: !0,
			getCodeErrMsg: "",
			livingbodyTitle: "请保持正脸对准框内",
			isPrepare: !0,
			curNumberStatus: ["verifyCurrentNumber", "", "", ""],
			curNumber: ["·", "·", "·", "·"],
			isActionSeqNormal: "",
			livingbodyActionText: "",
			livingbodySilentText: "",
			uploadProcess: 0,
			showTestVideo: !1,
			video_preview: "",
			video_src: "",
			isInfinityDisplayHTTitle: "",
			isInfinityDisplayHTBottom: "",
			isInfinityDisplayHTMiddle: "",
			isInfinityDisplayHTActionPre: "",
			isInfinityDisplayHTNumberPre: "",
			isInfinityDisplayHTActionHint: "",
			isInfinityDisplayHTNumberHint: ""
		},
		failPage: {
			is_modal_showing: !1
		},
		successPage: {},
		failInfo: {}
	},
	onLoad: function(i) {
		if (console.log(i), this.setData({
				cmsConfig: wx.verify_CMSConfig,
				token: wx.verify_TOKEN,
				bizData: wx.verify_BizData
			}), console.log("this.data.cmsConfig =", this.data.cmsConfig), console.log(`this.data.token = ${this.data.token}`),
			console.log(`wx.verifyBaseUrl = ${wx.verifyBaseUrl}`), console.log(this.data.cmsConfig.page.ocr.backend),
			BASE_URL = wx.verifyBaseUrl, wx.setNavigationBarTitle({
				title: this.data.cmsConfig.justForJumpVer.title,
				success: function() {
					console.log("setNavigationBarTitle success!")
				},
				fail: function(i) {
					console.log("setNavigationBarTitle failure!"), console.log(i)
				}
			}), "true" === i.isNotice) return console.log("is notice"), this.setData({
			curPage: 7
		}), void this.getTheNotice();
		console.log("is not notice"), this.data.cmsConfig.isGetUserLocation && this.getUserLocation(), wx.getSystemInfo({
			success: i => {
				console.log(i);
				var o = i.screenHeight / i.screenWidth >= 2;
				i.screenHeight > 700 && o && this.setData({
					isInfinityDisplay: !0,
					"ocr.isInfinityDisplayOcrBottom": "isInfinityDisplayOcrBottom",
					"ocr.isInfinityDisplayOcrMiddle": "isInfinityDisplayOcrMiddle",
					"ocr.isInfinityDisplayOcrTitle": "isInfinityDisplayOcrTitle",
					"livingbody.isInfinityDisplayHTBottom": "isInfinityDisplayHTBottom",
					"livingbody.isInfinityDisplayHTMiddle": "isInfinityDisplayHTMiddle",
					"livingbody.isInfinityDisplayHTTitle": "isInfinityDisplayHTTitle",
					"livingbody.isInfinityDisplayHTActionPre": "isInfinityDisplayHTActionPre",
					"livingbody.isInfinityDisplayHTNumberPre": "isInfinityDisplayHTNumberPre",
					"livingbody.isInfinityDisplayHTActionHint": "isInfinityDisplayHTActionHint",
					"livingbody.isInfinityDisplayHTNumberHint": "isInfinityDisplayHTNumberHint"
				})
			}
		})
	},
	getTheNotice() {
		var i = {
			url: BASE_URL + "notices.php",
			data: {
				appid: this.data.bizData.appid
			}
		};
		util.request(i, i => {
			if (console.log(i), 0 === i.ErrorCode) {
				var o = JSON.parse(i.Data);
				this.setData({
					"notice.content": o[0].content,
					"notice.title": o[0].title
				})
			} else wx.showModal({
				title: "提示",
				content: "获取公告信息失败，" + i.ErrorMsg,
				confirmText: "重试",
				showCancel: !1,
				confirmColor: "#2d72f1",
				success: i => {
					i.confirm && this.getTheNotice()
				}
			})
		})
	},
	onReady: function() {},
	onShow: function() {
		this.data.show_auth_panel && setTimeout(() => {
			this.isAuthOk()
		}, 500)
	},
	onHide: function() {},
	onUnload: function() {},
	onPullDownRefresh: function() {},
	onReachBottom: function() {},
	onShareAppMessage: function() {},
	showErrorToast: function(i) {
		if (console.log("showErrorToast", i), 3 === this.data.curPage) {
			if (this.data.ocr.isShowResult) return void this.setData({
				"ocr.hintErrorResult": i.error_msg
			});
			this.data.ocr.isShowTakePhoto && 101 !== i.ErrorCode && -107 !== i.ErrorCode && this.data.iKnowFuncs.push(() => {
				this.reTakePhoto()
			})
		}
		this.setData({
			showErrorMsg: !0,
			err: i
		})
	},
	switchDialog: function() {
		if (this.setData({
				showErrorMsg: !this.data.showErrorMsg
			}), 1 === this.data.iKnowFuncs.length) {
			this.data.iKnowFuncs.pop()()
		}
	},
	checkNetWork: function(i) {
		var o = this;
		wx.getNetworkType({
			success: function(e) {
				"none" !== e.networkType ? i() : (console.log("Network is none"), o.showErrorToast({
					ErrorCode: 101,
					ErrorMsg: "网络异常，请稍后重试"
				}))
			},
			fail: function(i) {
				console.log("Get Network exception"), o.showErrorToast({
					ErrorCode: 101,
					ErrorMsg: "网络异常，请稍后重试"
				})
			}
		})
	},
	checkRecordNetworkOk: function(i, o) {
		wx.getNetworkType({
			success: function(e) {
				"none" !== e.networkType ? (console.log("network is OK"), i(e.networkType)) : (console.log("Network is none"),
					o({
						ErrorCode: 101,
						ErrorMsg: "网络异常，请稍后再试"
					}))
			},
			fail: function(i) {
				console.log("Get Network exception"), o({
					ErrorCode: 101,
					ErrorMsg: "网络异常，请稍后再试"
				})
			}
		})
	},
	returnAllCheckNetWork(i) {
		wx.getNetworkType({
			success: function(o) {
				i(o.networkType)
			},
			fail: function(o) {
				i("none")
			}
		})
	},
	isNotAllowClick: function() {
		var i = +new Date;
		return i - this.data.preClickBtnTime < 1e3 ? (console.log("Click button gap < 1s, not allow exec"), !0) : (this.data
			.preClickBtnTime = i, console.log("Click button gap > 1s, allow exec"), !1)
	},
	exitVerify(i) {
		i.BizToken = this.data.token, i.ErrorCode = 0, this.data.bizData.endPath ? wx.verifySuccessFunc(i) : wx.navigateBack({
			success: function(o) {
				wx.verifySuccessFunc(i)
			}
		})
	},
	exitVerifyFail(i) {
		i.BizToken = this.data.token, this.data.bizData.endPath ? -999 === i.ErrorCode ? wx.navigateBack({
				success: () => {}
			}) : (console.log("exitVerifyFail: this.data.bizData.endPath", this.data.bizData.endPath), wx.verifyFailureFunc(i)) :
			wx.navigateBack({
				success: () => {
					-999 !== i.ErrorCode && wx.verifyFailureFunc(i)
				}
			})
	},
	switchIndexRule: function() {
		this.setData({
			index_rule: !this.data.index_rule
		})
	},
	switchAboutDlg: function() {
		this.setData({
			show_about_dlg: !this.data.show_about_dlg
		})
	},
	checkboxChange(i) {
		this.setData({
			indexDisableBtn: !this.data.indexDisableBtn
		})
	},
	getUserLocation: function() {
		var i = this;
		wx.getLocation({
			type: "wgs84",
			success: function(o) {
				console.log("Get the location success!", o);
				var e = {
					url: BASE_URL + `/api/auth/saveLocation?BizToken=${i.data.token}`,
					data: {
						Longitude: o.longitude,
						Latitude: o.latitude
					}
				};
				util.request(e, function(o) {
					if (0 === o.ErrorCode) console.log("Report location success!");
					else {
						if (console.log(o.ErrorCode), tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail({
							ErrorCode: o.ErrorCode,
							ErrorMsg: o.ErrorMsg
						});
						i.showErrorToast(o)
					}
				})
			},
			fail: function(i) {
				console.log("Get location failure!"), console.log(i)
			}
		})
	},
	startNativeVerify: function() {
		console.log("直接调用微信原生接口");
		let i = this.data.cmsConfig,
			o = i.Common.WxVerifyTypeIsVideo,
			e = i.Common.WxCheckAliveType;
		util.startNativeVerify(o, e, BASE_URL, this.data.token, this.exitVerifyFail, i => {
			let o = {
				BizToken: this.data.token,
				ErrorCode: i.ErrorCode,
				ErrorMsg: i.ErrorMsg
			};
			0 === i.ErrorCode ? this.exitVerify(o) : this.exitVerifyFail(o)
		})
	},
	indexToNext: async function() {
		if (!this.isNotAllowClick()) {
			var i = this;
			this.checkNetWork(function() {
				var o = i.data.cmsConfig;
				if (!i.data.cmsConfig.Common.IsWxNative || i.data.cmsConfig.Common.Flow.includes("Ocr")) {
					var e = 2;
					o.isHideSmsPage && (e = o.isHideOcrPage ? 4 : 3), i.setData({
						curPage: e
					}), (4 === e || 3 === e && !i.data.cmsConfig.page.ocr.isManualInput) && i.preLivingbodyExec()
				} else i.startNativeVerify()
			})
		}
	},
	phoneNumChanged(i) {
		this.setData({
			"sms.hintError": ""
		});
		var o = i.detail.value;
		this.data.sms.phoneNum = o;
		var e = util.validate(o, "sms_phone");
		console.log(`isPhoneOk: ${e}`), e && !this.data.sms.is60sGap && this.setData({
			"sms.isEnableSendSms": !0
		}), e || this.setData({
			"sms.isEnableSendSms": !1
		});
		var t = util.validate(this.data.sms.verifyCode, "sms_verifyCode");
		e && t ? this.setData({
			"sms.isForbiddenSmsBtn": !1
		}) : this.setData({
			"sms.isForbiddenSmsBtn": !0
		}), console.log(`isEnableSendSms: ${this.data.sms.isEnableSendSms}`)
	},
	sendVerifyCodeReq: function() {
		if (!this.isNotAllowClick()) {
			var i = this;
			this.checkNetWork(function() {
				let o = {
					url: `${BASE_URL}/api/common/sendSmsCode?BizToken=${i.data.token}`,
					data: {
						PhoneNum: i.data.sms.phoneNum
					}
				};
				wx.showLoading({
					title: "短信发送中...",
					mask: !0
				}), util.request(o, function(o) {
					if (wx.hideLoading(), 0 === o.ErrorCode) {
						i.setData({
							"sms.is60sGap": !0,
							"sms.isEnableSendSms": !1,
							"sms.sendSmsTtitle": "重新发送"
						});
						var e = setInterval(function() {
							i.data.sms.gapSec <= 1 && (clearInterval(e), i.setData({
								"sms.is60sGap": !1,
								"sms.gapSec": 60
							}), util.validate(i.data.sms.phoneNum, "sms_phone") && i.setData({
								"sms.isEnableSendSms": !0
							})), i.setData({
								"sms.gapSec": i.data.sms.gapSec - 1
							})
						}, 1e3)
					} else {
						if (tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail(o);
						i.setData({
							"sms.hintError": o.ErrorMsg
						})
					}
				})
			})
		}
	},
	verifyCodeChanged(i) {
		this.setData({
			"sms.hintError": ""
		}), this.data.sms.verifyCode = i.detail.value;
		var o = util.validate(this.data.sms.verifyCode, "sms_verifyCode");
		util.validate(this.data.sms.phoneNum, "sms_phone") && o ? this.setData({
			"sms.isForbiddenSmsBtn": !1
		}) : this.setData({
			"sms.isForbiddenSmsBtn": !0
		})
	},
	smsToNext() {
		if (!this.isNotAllowClick()) {
			var i = this;
			this.checkNetWork(function() {
				console.log(i.data.sms.phoneNum + " | " + i.data.sms.verifyCode);
				let o = {
					url: `${BASE_URL}/api/common/verifySmsCode?BizToken=${i.data.token}`,
					data: {
						PhoneNum: i.data.sms.phoneNum,
						VerifyCode: i.data.sms.verifyCode
					}
				};
				wx.showLoading({
					title: "加载中...",
					mask: !0
				}), util.request(o, function(o) {
					if (wx.hideLoading(), 0 === o.ErrorCode) {
						var e = i.data.cmsConfig;
						if (e.isJustSms) i.exitVerify({});
						else {
							var t = 3;
							e.isHideOcrPage && (t = 4), i.setData({
								curPage: t
							}), (4 === t || 3 === t && !i.data.cmsConfig.page.ocr.isManualInput) && i.preLivingbodyExec()
						}
					} else {
						if (tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail(o);
						i.setData({
							"sms.hintError": o.ErrorMsg
						})
					}
				})
			})
		}
	},
	idcartManualInputChanged(i) {
		var o = i.detail.value;
		this.data.ocr.idcard = o, this.manualInputChanged()
	},
	idnameManualInputChanged(i) {
		var o = i.detail.value;
		this.data.ocr.idname = o, this.manualInputChanged()
	},
	manualInputChanged(i) {
		this.setData({
			"ocr.hintError": ""
		});
		var o = util.validate(this.data.ocr.idcard, "idcard"),
			e = util.validate(this.data.ocr.idname, "idname"),
			t = !0;
		o || 18 !== this.data.ocr.idcard.length ? o && (e && (t = !1), this.setData({
			"ocr.isForbiddenManualBtn": t
		})) : this.setData({
			"ocr.hintError": "身份证号有误，请确认后重新输入"
		})
	},
	manualInputGoNext() {
		this.ocrCommonInputGoNext(!0)
	},
	ocrCommonInputGoNext(i) {
		var o = this;
		this.checkNetWork(function() {
			o.data.cmsConfig;
			wx.showLoading({
				title: "校验身份信息中...",
				mask: !0
			});
			let e = 0;
			"android" === wx.verifySysInfo.platform && (e = 300), setTimeout(() => {
				var e = {
					url: `${BASE_URL}/api/ocr/updateidinfo?BizToken=${o.data.token}`,
					data: {
						Name: o.data.ocr.idname,
						IdCard: o.data.ocr.idcard
					}
				};
				o.data.ocr.idaddress && (e.data.Address = o.data.ocr.idaddress), util.request(e, function(e) {
					if (wx.hideLoading(), 0 !== e.ErrorCode) {
						if (tokenExceptionArr.includes(e.ErrorCode)) return void o.exitVerifyFail(e);
						let t = {
							"ocr.hintError": e.ErrorMsg
						};
						return i || (t = {
							"ocr.hintErrorResult": e.ErrorMsg
						}), void o.setData(t)
					}
					o.ocrGoNext(i)
				})
			}, e)
		})
	},
	ocrGoNext(i) {
		var o = this;
		if (o.data.cmsConfig.page.ocr.isCheckIDInfo) {
			let e = {
				url: `${BASE_URL}/api/ocr/checkidinfo?BizToken=${this.data.token}`,
				data: {
					Name: this.data.ocr.idname,
					IdCard: this.data.ocr.idcard
				}
			};
			util.request(e, e => {
				if (0 !== e.ErrorCode) {
					if (tokenExceptionArr.includes(e.ErrorCode)) return void o.exitVerifyFail(e);
					let t = {
						"ocr.hintError": e.ErrorMsg
					};
					return console.log(e.ErrorMsg), i || (t = {
						"ocr.hintErrorResult": e.ErrorMsg
					}), void o.setData(t)
				}
				this.ocrGoNextEnd()
			})
		} else this.ocrGoNextEnd()
	},
	ocrGoNextEnd() {
		if (this.data.cmsConfig.isJustOcr) this.exitVerify({
			id_name: this.data.ocr.idname,
			id_number: this.data.ocr.idcard,
			id_address: this.data.ocr.idaddress
		});
		else {
			if (this.data.cmsConfig.Common.IsWxNative) return void this.startNativeVerify();
			this.setData({
				curPage: 4
			}), this.preLivingbodyExec()
		}
	},
	manualInputTakePhone() {
		this.setData({
			"cmsConfig.page.ocr.isManualInput": !1,
			"ocr.isEditTheOcrIsManualInput": !0
		})
	},
	btnclick: function() {
		var i = this.data.cmsConfig.page.ocr.backend;
		console.log(i)
	},
	ocrStartTakePhoto() {
		var i = this;
		this.checkNetWork(function() {
			i.setData({
				"ocr.isShowTakePhoto": !0,
				isNotCamera: !1
			})
		})
	},
	takePhotoWithCamera() {
		var i = this;
		wx.createCameraContext().takePhoto({
			quality: "noraml",
			success: o => {
				console.log(o.tempImagePath), this.setData({
					"ocr.tempImagePath": o.tempImagePath,
					"ocr.isShowPhotoPreView": !0,
					"ocr.ocrTitle": "照片预览",
					"ocr.isPhotoFromCamera": !0
				}), console.log(i.data.ocr.tempImagePath)
			},
			fail: i => {
				wx.showToast({
					title: "takePhoto function exception",
					icon: "none"
				})
			}
		})
	},
	chooseImg() {
		var i = this;
		wx.chooseImage({
			count: 1,
			sizeType: ["compressed"],
			sourceType: ["album"],
			success: function(o) {
				var e = o.tempFilePaths;
				i.setData({
					"ocr.tempImagePath": e[0],
					"ocr.isShowPhotoPreView": !0,
					"ocr.ocrTitle": "照片预览",
					"ocr.isPhotoFromCamera": !1
				}), i.setData({
					"ocr.isToolsShow": !1
				}), i.setData({
					"ocr.isToolsShow": !0
				})
			}
		})
	},
	reTakePhoto() {
		let i = this.data.ocr.isFrontIdCard ? "请拍摄身份证人像面" : "请拍摄身份证国徽面";
		this.setData({
			"ocr.tempImagePath": "",
			"ocr.isShowPhotoPreView": !1,
			"ocr.ocrTitle": i
		})
	},
	startUploadAndOcr() {
		var i = this;
		this.checkNetWork(() => {
			wx.showLoading({
				title: "系统识别中",
				mask: !0
			});
			let o = {
				file: i.data.ocr.tempImagePath
			};
			console.log("upfile data", o), wx.uploadFile({
				url: `${BASE_URL}/api/common/upLoadWxAppFile?BizToken=${i.data.token}`,
				filePath: this.data.ocr.tempImagePath,
				name: "file",
				formData: o,
				success: o => {
					if (console.log("uploadFile | ", o), 200 === o.statusCode) {
						let e = JSON.parse(o.data);
						if (0 === e.ErrorCode) {
							let o = {
								url: `${BASE_URL}/api/ocr/ocrinfo?BizToken=${this.data.token}`,
								data: {
									MediaKey: e.Data.MediaKey,
									PicType: this.data.ocr.isFrontIdCard ? 0 : 1
								}
							};
							console.log("ocrinfo data", o), util.request(o, o => {
								if (wx.hideLoading(), 0 === o.ErrorCode) {
									if (this.data.ocr.isFrontIdCard && this.setData({
											"ocr.idcard": o.Data.id,
											"ocr.idname": o.Data.name,
											"ocr.idaddress": o.Data.address
										}), this.data.ocr.isFrontIdCard && this.data.cmsConfig.page.ocr.backend) return void this.setData({
										"ocr.tempImagePath": "",
										"ocr.isShowPhotoPreView": !1,
										"ocr.ocrTitle": "请拍摄身份证国徽面",
										"ocr.isFrontIdCard": !1
									});
									this.setData({
										"ocr.isShowResult": !0,
										isNotCamera: !0,
										"ocr.verifycamFullScreen": "verifycamFullScreen"
									})
								} else {
									if (tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail(o);
									this.showErrorToast(o)
								}
							})
						} else wx.hideLoading(), this.showErrorToast({
							ErrorCode: 101,
							ErrorMsg: e.ErrorMsg
						})
					} else wx.hideLoading(), this.showErrorToast({
						ErrorCode: 101,
						ErrorMsg: "上传图片失败"
					})
				},
				fail: i => {
					console.log("upload img fail", i), wx.hideLoading(), this.showErrorToast({
						ErrorCode: 101,
						ErrorMsg: "上传图片失败"
					})
				}
			})
		})
	},
	idnameInputChanged(i) {
		this.data.ocr.idname = i.detail.value, this.ocrCommonInputCheck()
	},
	idcartInputChanged(i) {
		this.data.ocr.idcard = i.detail.value, this.ocrCommonInputCheck()
	},
	idaddressInputChanged(i) {
		this.data.ocr.idaddress = i.detail.value, this.ocrCommonInputCheck()
	},
	ocrCommonInputCheck() {
		this.setData({
			"ocr.hintErrorResult": ""
		});
		var i = util.validate(this.data.ocr.idcard, "idcard"),
			o = util.validate(this.data.ocr.idname, "idname"),
			e = util.validate(this.data.ocr.idaddress, "idaddress"),
			t = !0;
		i && o && (t = !1), this.data.cmsConfig.page.ocr.isAddress && !e && (t = !0), this.setData({
			"ocr.isForbiddenResultBtn": t
		})
	},
	ocrInputGoNext(i) {
		if (util.validate(this.data.ocr.idcard, "idcard"))
			if (util.validate(this.data.ocr.idname, "idname")) {
				if (this.data.cmsConfig.page.ocr.isAddress)
					if (!util.validate(this.data.ocr.idaddress, "idaddress")) return void this.setData({
						"ocr.hintErrorResult": "住址格式错误"
					});
				console.log("go next"), this.ocrCommonInputGoNext(!1)
			} else this.setData({
				"ocr.hintErrorResult": "姓名格式错误"
			});
		else this.setData({
			"ocr.hintErrorResult": "身份证号格式错误"
		})
	},
	switchLivingbodyDialog(i) {
		this.setData({
			"livingbody.isShowDialog": !this.data.livingbody.isShowDialog
		})
	},
	preLivingbodyExec() {
		var i = this;
		if (4 !== this.data.curPage || 0 !== this.data.cmsConfig.livingbodyType && 1 !== this.data.cmsConfig.livingbodyType)
			i.getAuth();
		else {
			let o = {
				url: `${BASE_URL}/api/liveness/lipcode?BizToken=${i.data.token}`,
				data: {}
			};
			1 === i.data.cmsConfig.livingbodyType && (o.url = `${BASE_URL}/api/liveness/actioncode?BizToken=${i.data.token}`),
				util.request(o, o => {
					if (0 === o.ErrorCode) {
						console.log("Got the LipCode：" + o.Data.LipCode), console.log("Got the ActionCode:" + o.Data.ActionCode);
						var e = {
							"livingbody.livingbodyNumber": o.Data.LipCode
						};
						1 === i.data.cmsConfig.livingbodyType && (e = {
							"livingbody.isActionSeqNormal": "21" === o.Data.ActionCode.join("")
						}), this.setData(e), i.getAuth()
					} else {
						if (tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail(o);
						this.setData({
							"livingbody.getCodeErrMsg": o.ErrorMsg
						}), i.getAuth()
					}
				})
		}
	},
	getAuth: function() {
		let i = this;
		wx.authorize({
			scope: "scope.camera",
			success() {},
			fail: function() {
				console.log("您未允许使用摄像头权限")
			},
			complete: function() {
				4 === i.data.curPage ? wx.authorize({
					scope: "scope.record",
					success() {},
					fail: function() {
						console.log("您未允许使用录音权限")
					},
					complete: function() {
						console.log("开始判断是否有权限"), i.isAuthOk()
					}
				}) : i.isAuthOk()
			}
		})
	},
	isAuthOk: function() {
		var i = this;
		wx.getSetting({
			success(o) {
				console.log("获取授权信息成功");
				var e = o.authSetting["scope.record"],
					t = o.authSetting["scope.camera"];
				if (4 === i.data.curPage)
					if (e && t) i.setData({
						show_auth_panel: !1,
						authInfo: "摄像头、录音功能都已授权"
					}), i.authOkToDo(), console.log("摄像头、录音功能都已授权");
					else {
						var a = "";
						t || (a = "摄像头 "), e || (a += "录音功能"), a += "还未授权", console.log(a), i.setData({
							show_auth_panel: !0,
							authInfo: a
						})
					}
				else t ? i.setData({
					show_auth_panel: !1,
					authInfo: "摄像头已授权"
				}) : i.setData({
					show_auth_panel: !0,
					authInfo: "摄像头未授权"
				})
			},
			fail: function(i) {
				console.log("获取收取信息失败", i)
			}
		})
	},
	authOkToDo() {
		console.log(this.data.livingbody.livingbodyNumber, this.data.cmsConfig.livingbodyType), 0 === this.data.cmsConfig.livingbodyType &&
			"" === this.data.livingbody.livingbodyNumber || 1 === this.data.cmsConfig.livingbodyType && "" === this.data.livingbody
			.isActionSeqNormal ? this.theLivingBodyNumberMustBeOk() : (this.livingbodyAutoShowDialog(), this.setData({
				"livingbody.isNotPrepareOk": !1
			}))
	},
	theLivingBodyNumberMustBeOk() {
		var i = this;
		wx.showModal({
			title: "提示",
			content: "获取code失败，" + i.data.livingbody.getCodeErrMsg,
			showCancel: !1,
			confirmText: "重新获取",
			confirmColor: "#2d72f1",
			success: function(o) {
				if (o.confirm) {
					console.log("开始重新获取"), wx.showLoading({
						title: "重新获取中...",
						mask: !0
					});
					let o = {
						url: `${BASE_URL}/api/liveness/lipcode?BizToken=${i.data.token}`,
						data: {}
					};
					1 === i.data.cmsConfig.livingbodyType && (o.url =
						`${BASE_URL}/api/liveness/actioncode?BizToken=${i.data.token}`), util.request(o, o => {
						if (wx.hideLoading(), 0 === o.ErrorCode) console.log("Got the LipCode：" + o.Data.LipCode), console.log(
								"Got the ActionCode:" + o.Data.ActionCode), i.livingbodyAutoShowDialog(), 1 === i.data.cmsConfig.livingbodyType ?
							i.setData({
								"livingbody.isActionSeqNormal": "21" === o.Data.ActionCode.join(""),
								"livingbody.isNotPrepareOk": !1
							}) : i.setData({
								"livingbody.livingbodyNumber": o.Data.LipCode,
								"livingbody.isNotPrepareOk": !1
							});
						else {
							if (tokenExceptionArr.includes(o.ErrorCode)) return void i.exitVerifyFail(o);
							i.setData({
								"livingbody.getCodeErrMsg": o.ErrorMsg
							}), i.theLivingBodyNumberMustBeOk()
						}
					})
				}
			}
		})
	},
	livingbodyAutoShowDialog() {
		let i = wx.getStorageSync("isAlreadyShowVideoRule");
		console.log("isAlreadyShowVideoRule:" + i), i || (this.setData({
			"livingbody.isShowDialog": !this.data.livingbody.isShowDialog
		}), wx.setStorage({
			key: "isAlreadyShowVideoRule",
			data: "true"
		}))
	},
	livingbodyStartToRecord() {
		this.checkNetWork(() => {
			console.log("go"), this.setData({
				"livingbody.isShowCamera": !0,
				isNotCamera: !1
			}), setTimeout(() => {
				this.checkRecordNetworkOk(() => {
					ctx = wx.createCameraContext(), console.log("start startRecord", +new Date), ctx.startRecord({
						success: i => {
							console.log("startRecord success", +new Date);
							let o = this.data.cmsConfig.livingbodyType,
								e = {
									"livingbody.isPrepare": !1
								},
								t = 0,
								a = 1200,
								s = 1e3,
								r = this.data.livingbody.livingbodyNumber + "",
								n = ["", "", "", ""],
								d = ["·", "·", "·", "·"],
								l = this.data.cmsConfig.page.livingbody.silentRecordTime - 1;
							if (0 === o) d[t] = r[t], n[t] = "verifyCurrentNumber", e["livingbody.livingbodyTitle"] = "请大声朗读以下数字",
								e["livingbody.curNumberStatus"] = n, e["livingbody.curNumber"] = d, s = 1500;
							else if (1 === o) {
								let i = this.data.livingbody.isActionSeqNormal;
								e["livingbody.livingbodyTitle"] = "请做以下动作", e["livingbody.livingbodyActionText"] = i ? "眨眨眼" : "张张嘴",
									a = 2e3
							} else e["livingbody.livingbodySilentText"] = l, a = 1e3;
							this.setData(e);
							let c = setInterval(() => {
								if (0 === o) {
									if (3 === t) return clearInterval(c), void this.stopRecordAndProcess(s);
									d[++t] = r[t], n[t] = "verifyCurrentNumber", this.setData({
										"livingbody.curNumberStatus": n,
										"livingbody.curNumber": d
									})
								} else if (1 === o) {
									if (1 === t) return clearInterval(c), void this.stopRecordAndProcess(s);
									t++, this.setData({
										"livingbody.livingbodyActionText": this.data.livingbody.isActionSeqNormal ? "张张嘴" : "眨眨眼"
									})
								} else {
									if (0 === l) return clearInterval(c), void this.stopRecordAndProcess(s);
									l--, this.setData({
										"livingbody.livingbodySilentText": l
									})
								}
							}, a)
						},
						fail: i => {
							this.setData({
								"livingbody.isShowGuide": !0,
								"livingbody.isShowCamera": !1,
								isNotCamera: !0,
								"livingbody.isPrepare": !0
							}), console.log("start record fail", +new Date, i), this.showErrorToast({
								ErrorCode: -108,
								ErrorMsg: `网络异常，${i.errMsg}`
							})
						},
						timeoutCallback: i => {
							console.log("timeoutCallback", i), this.setData({
								"livingbody.isShowGuide": !0,
								"livingbody.isShowCamera": !1,
								isNotCamera: !0,
								"livingbody.isPrepare": !0
							}), this.showErrorToast({
								ErrorCode: -108,
								ErrorMsg: "startRecord timeoutCallback, 请重试！"
							})
						}
					})
				}, i => {
					this.setData({
						"livingbody.isShowGuide": !0,
						"livingbody.isShowCamera": !1,
						isNotCamera: !0
					}), this.showErrorToast(i)
				})
			}, 2e3)
		})
	},
	stopRecordAndProcess(i) {
		console.log("start stopRecord", +new Date), setTimeout(() => {
			console.log("stopTimeGap" + i), console.log(ctx.stopRecord), ctx.stopRecord({
				success: i => {
					console.log("stopRecord success", +new Date, i), wx.getFileInfo({
						filePath: i.tempVideoPath,
						success: o => {
							var e = Math.round(o.size / 1e3);
							e > 8192 ? (this.setData({
								"livingbody.isShowGuide": !0,
								"livingbody.isShowCamera": !1,
								isNotCamera: !0,
								"livingbody.isPrepare": !0
							}), this.showErrorToast({
								ErrorCode: -108,
								ErrorMsg: "视频大小超过限制"
							})) : this.processTheVideo(i.tempVideoPath, e + "K")
						},
						fail: i => {
							this.setData({
								"livingbody.isShowGuide": !0,
								"livingbody.isShowCamera": !1,
								isNotCamera: !0,
								"livingbody.isPrepare": !0
							}), this.showErrorToast({
								ErrorCode: -108,
								ErrorMsg: `getFileInfo异常，${i.errMsg}`
							})
						}
					})
				},
				fail: i => {
					this.setData({
						"livingbody.isShowGuide": !0,
						"livingbody.isShowCamera": !1,
						isNotCamera: !0,
						"livingbody.isPrepare": !0
					}), this.showErrorToast({
						ErrorCode: -108,
						ErrorMsg: `stopRecord异常，${i.errMsg}`
					})
				},
				complete(i) {
					console.log("complete", i)
				}
			})
		}, i)
	},
	processTheVideo(i, o) {
		this.checkRecordNetworkOk(e => {
			this.goToProcessPage(i, o)
		}, e => {
			this.setData({
				"livingbody.isShowGuide": !0,
				"livingbody.isShowCamera": !1,
				isNotCamera: !0,
				"livingbody.isPrepare": !0
			}), wx.showModal({
				title: "提示",
				content: "网络异常，请检查网络后重试",
				confirmText: "重试",
				confirmColor: "#2d72f1",
				success: e => {
					e.confirm && this.processTheVideo(i, o)
				}
			})
		})
	},
	goToProcessPage(i, o) {
		this.setData({
			"livingbody.isShowGuide": !1,
			"livingbody.isShowCamera": !1,
			"livingbody.isShowProcess": !0,
			isNotCamera: !0,
			"livingbody.isPrepare": !0
		});
		let e = {
			url: `${BASE_URL}/api/common/upLoadWxAppFile?BizToken=${this.data.token}`,
			filePath: i,
			data: {
				file: i
			}
		};
		this.uploadTheVideo(e, o)
	},
	uploadTheVideo(i, o) {
		this.returnAllCheckNetWork(e => {
			"wifi" !== e && "none" !== e ? wx.showModal({
				title: "提示",
				content: `视频大约${o}，在移动网络环境下上传会产生手机流量，确认继续？`,
				confirmText: "继续",
				confirmColor: "#2d72f1",
				success: e => {
					e.confirm ? this.uploadTheVideoMain(i, o) : this.setData({
						"livingbody.isShowGuide": !0,
						"livingbody.isShowCamera": !1,
						"livingbody.isShowProcess": !1,
						isNotCamera: !0,
						"livingbody.isPrepare": !0
					})
				}
			}) : this.uploadTheVideoMain(i, o)
		})
	},
	uploadTheVideoMain(i, o) {
		util.uploadFile.call(this, i, e => {
			if (console.log("上传视频成功"), console.log(e), 0 === e.ErrorCode) console.log("uploadSuccess"), console.log(e.Data.Data
				.MediaKey), this.livingbodyVerify(e.Data.Data.MediaKey);
			else {
				var t = "网络异常，上传视频失败";
				101 !== e.ErrorCode && (t = e.ErrorMsg), wx.showModal({
					title: "提示",
					content: t,
					showCancel: !1,
					confirmText: "重试",
					confirmColor: "#2d72f1",
					success: e => {
						e.confirm && this.uploadTheVideo(i, o)
					}
				})
			}
		})
	},
	livingbodyVerify(i) {
		let o = this.data.cmsConfig.livingbodyType,
			e = "/api/liveness/lipliveness";
		1 === o ? e = "/api/liveness/actionliveness" : 2 === o && (e = "/api/liveness/silentliveness");
		let t = {
			url: `${BASE_URL}${e}?BizToken=${this.data.token}`,
			data: {
				MediaKey: i
			}
		};
		console.log(t), util.request(t, o => {
			if (console.log(o), 0 === o.ErrorCode) this.data.cmsConfig.page.success.isAutoSkip ? this.exitVerify({}) : this.setData({
				curPage: 6
			});
			else if (-107 === o.ErrorCode || 101 === o.ErrorCode) wx.showModal({
				title: "提示",
				content: o.error_msg,
				showCancel: !1,
				confirmText: "重试",
				confirmColor: "#2d72f1",
				success: o => {
					o.confirm && this.livingbodyVerify(i)
				}
			});
			else if (tokenExceptionArr.includes(o.ErrorCode)) this.exitVerifyFail(o);
			else {
				void 0 === o.ErrorCode && (o.ErrorCode = "9999", sysFailInfo[9999].tips1 = o.Data);
				var e = o.ErrorCode + "",
					t = {};
				(t = this.data.cmsConfig.failInfo && this.data.cmsConfig.failInfo[e] ? this.data.cmsConfig.failInfo[e] :
					sysFailInfo[e] ? sysFailInfo[e] : {
						img: "",
						msg: o.ErrorMsg,
						error_code: o.ErrorCode
					}).Data = o.Data || {}, console.log("failInfo: ", t), this.setData({
					failInfo: t,
					curPage: 5
				})
			}
		})
	},
	failReVerify() {
		if (console.log(this.data.failInfo), "无效请求" !== this.data.failInfo.msg && 14 !== this.data.failInfo.error_code) {
			var i = 4;
			if (idExceptionArr.includes(this.data.failInfo.error_code)) {
				if (this.data.cmsConfig.isHideOcrPage) return void this.exitVerifyFail({
					Token: this.data.token,
					ErrorCode: this.data.failInfo.error_code,
					ErrorMsg: this.data.failInfo.msg
				});
				i = 3, this.setData({
					"ocr.isShowTakePhoto": !1,
					"ocr.isShowResult": !1,
					"ocr.isShowGuide": !0,
					"ocr.isShowPhotoPreView": !1,
					"ocr.isPhotoFromCamera": !1,
					"ocr.isFrontIdCard": !0,
					"ocr.hintError": "",
					"ocr.hintErrorResult": "",
					"ocr.isForbiddenManualBtn": !0,
					"ocr.isForbiddenResultBtn": !1,
					"ocr.idcard": "",
					"ocr.idname": "",
					"ocr.idaddress": "",
					"ocr.tempImagePath": "",
					"ocr.ocrTitle": "请拍摄身份证人像面",
					"ocr.isToolsShow": !0
				}), this.data.ocr.isEditTheOcrIsManualInput && this.setData({
					"cmsConfig.page.ocr.isManualInput": !0
				})
			}
			this.setData({
				curPage: i,
				"livingbody.isShowGuide": !0,
				"livingbody.isShowCamera": !1,
				"livingbody.isShowProcess": !1,
				"livingbody.isShowDialog": !1,
				"livingbody.livingbodyNumber": "",
				"livingbody.isNotPrepareOk": !0,
				"livingbody.getCodeErrMsg": "",
				"livingbody.livingbodyTitle": "请保持正脸对准框内",
				"livingbody.isPrepare": !0,
				"livingbody.curNumberStatus": ["verifyCurrentNumber", "", "", ""],
				"livingbody.curNumber": ["·", "·", "·", "·"],
				"livingbody.isActionSeqNormal": !0,
				"livingbody.livingbodyActionText": "",
				"livingbody.livingbodySilentText": "",
				"livingbody.uploadProcess": 0
			}), this.preLivingbodyExec()
		} else {
			this.exitVerifyFail({
				ErrorCode: 14,
				ErrorMsg: "由于活体验证时出现网络异常，导致无效请求，需要您重新验证，验证时请保持网络畅通！"
			})
		}
	},
	successGoToNext() {
		this.exitVerify({})
	},
	verifyBackToIndex() {
		var i = {};
		i.Token = this.data.token, i.ErrorCode = -999, i.ErrorMsg = "返回首页成功，如多次验证不通过，可将当前页面截图提供给相关工作人员排查问题 " + this.data.bizData
			.appid + " | " + i.token, this.exitVerifyFail(i)
	},
	switchfailModal() {
		this.setData({
			"failInfo.is_modal_showing": !this.data.failInfo.is_modal_showing
		})
	},
	ocrCameraError: function(i) {
		console.log("ocrCameraError", i)
	},
	bindstop: function(i) {
		console.log(i)
	}
});
