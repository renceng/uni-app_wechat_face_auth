const regeneratorRuntime=require("./utils/regenerator-runtime/runtime"),util=require("./utils/util"),defaultConfig=require("./config.js").defaultConfig,extend=require("./utils/extend.js").extend;var init=function(e){wx.onNetworkStatusChange(function(e){"none"!==e.networkType&&"2g"!==e.networkType||wx.showToast({title:"网络异常",icon:"none"})}),wx.onMemoryWarning(function(){wx.showToast({title:"内存告警，有闪退风险",icon:"none"})}),wx.verifyBaseUrl||(wx.verifyBaseUrl="https://faceid.qq.com"),wx.startVerify=function(e){if(console.log("startVerify start, send data",e.data),e.data&&e.fail&&e.success){if(e.data.endPath){if(!util.validate(e.data.endPath,"end_path")){o={ErrorCode:-100,ErrorMsg:"调用SDK失败，endPath格式错误！"};return void wx.showModal({title:"提示",content:o.ErrorMsg,showCancel:!1})}e.fail=function(o){if(-999!==o.error_code){var i="";i=e.data.endPath.indexOf("?")>=0?e.data.endPath+"&data="+encodeURIComponent(JSON.stringify(o)):e.data.endPath+"?data="+encodeURIComponent(JSON.stringify(o)),console.log(i),wx.navigateTo({url:i,fail:e=>{console.log(e),wx.showModal({title:"提示",content:e.errMsg,showCancel:!1})}})}else wx.navigateBack()},e.success=function(o){var i="";i=e.data.endPath.indexOf("?")>=0?e.data.endPath+"&data="+JSON.stringify(o):e.data.endPath+"?data="+JSON.stringify(o),console.log(i),wx.redirectTo({url:i,fail:e=>{console.log(e),wx.showModal({title:"提示",content:e.errMsg,showCancel:!1})}})}}wx.verifySuccessFunc=e.success,wx.verifyFailureFunc=e.fail,util.validate(e.data.token,"token")?(console.log("data is ok",e.data),wx.showLoading({title:"加载中...",mask:!0}),getCmsConfig(e.data.token,function(o){if(console.log(o),wx.hideLoading(),0===o.ErrorCode){extend(!0,defaultConfig,o.Data.config);var i=defaultConfig;console.log("final cmsConfig"),console.log(i),wx.verifySysInfo=wx.getSystemInfoSync(),console.log(wx.verifySysInfo);var t="ios"===wx.verifySysInfo.platform?i.JustForMp.iOSVerLimit:i.JustForMp.androidVerLimit;if("devtools"!==wx.verifySysInfo.platform&&t&&util.compareVersion(t,wx.verifySysInfo.version)>0)return wx.hideLoading(),void wx.showModal({title:"提示",content:`当前微信版本低于${t}，无法使用该功能，请升级到最新微信版本后重试。`,showCancel:!1});if(wx.verifySysInfo.environment&&"wxwork"===wx.verifySysInfo.environment)return wx.showModal({title:"提示",content:"企业微信暂不支持使用此功能，请使用微信进行操作",showCancel:!1}),!1;i=reviseCmsConfig("",i),wx.verify_CMSConfig=i,wx.verify_TOKEN=e.data.token,wx.verify_BizData=e.data;if(i.Common.IsWxNative&&!i.Common.Flow.includes("Ocr")&&i.Common.IsHideIndexWhenNative){console.log("直接调用微信原生接口");let o=i.Common.WxVerifyTypeIsVideo,t=i.Common.WxCheckAliveType;util.startNativeVerify(o,t,wx.verifyBaseUrl,e.data.token,wx.verifyFailureFunc,o=>{let i={BizToken:e.data.token,ErrorCode:o.ErrorCode,ErrorMsg:o.ErrorMsg};0===o.ErrorCode?wx.verifySuccessFunc(i):wx.verifyFailureFunc(i)})}else console.log("进入验证页面"),wx.navigateTo({url:"/pages/face/face?isNotice="+!1})}else wx.showModal({title:"提示",content:o.ErrorMsg,showCancel:!1})})):wx.showModal({title:"提示",content:"调用SDK失败,token格式错误！",showCancel:!1})}else{var o={ErrorCode:-100,ErrorMsg:"调用SDK失败，wx.startVerify传入参数缺少！"};wx.showModal({title:"提示",content:o.ErrorMsg,showCancel:!1})}}},getCmsConfig=async function(e,o){try{var i={method:"POST",url:`${wx.verifyBaseUrl}/api/auth/getConfig?BizToken=${e}`},t=await util.requestPromise(i);200===t.statusCode&&t.data.Data&&0===t.data.ErrorCode?o({ErrorCode:0,Data:t.data.Data}):t.data.ErrorCode?o({ErrorCode:t.data.ErrorCode,ErrorMsg:`获取配置失败,${t.data.ErrorMsg}`}):o({ErrorCode:-104,ErrorMsg:"调用失败，获取配置异常！"})}catch(e){console.log("genConfig catch error",e),e.errMsg.indexOf("request:fail Unable to resolve host")>=0||e.errMsg.indexOf("request:fail 似乎已断开与互联网的连接")>=0?o({ErrorCode:101,ErrorMsg:"网络异常，请稍后重试"}):"request:fail url not in domain list"===e.errMsg?o({ErrorCode:-104,ErrorMsg:"接口还未添加到服务器域名，请点击右上角三个点，打开调试模式再试"}):o({ErrorCode:-104,ErrorMsg:"调用接口失败: "+e.errMsg})}},reviseCmsConfig=function(e,o){let i=o.Common.Flow,t=!1,n=!1,r=!1,s=!1,a=0,l=i.indexOf("LiveFour1V1")>=0||i.indexOf("LiveAction1V1")>=0||i.indexOf("LiveSilence1V1")>=0;-1===i.indexOf("Sms")&&(t=!0),-1===i.indexOf("Ocr")&&(n=!0),l&&(a=i.indexOf("LiveFour1V1")>=0?0:i.indexOf("LiveAction1V1")>=0?1:2),l||-1!==i.indexOf("Sms")||(r=!0),l||-1!==i.indexOf("Ocr")||(s=!0);let d={Common:o.Common,protocol:{title:o.Index.ProtocolTitle,content:o.Index.TencentProtocol,clientContent:o.Index.ClientProtocol},page:{index:{clientName:o.Index.ProjectName,businessName:o.Index.BusinessName,certificationCenter:o.Index.CooperationName,nextBtnName:o.Index.NextBtn,isHideTipsLogo:!o.Common.IsShowLogo,isHideTipsAbout:o.Common.IsHideAbout,protocolTitle:o.Index.ProtocolEntrance},ocr:{backend:o.Ocr.Backend,sourceType:o.Ocr.SourceType,isAddress:o.Ocr.IsAddress,isManualInput:o.Ocr.IsManualInput,isHideTakePhoto:o.Ocr.IsHideManualInputTakePhotoBtn,isCheckIDInfo:o.Ocr.IsCheckIdInfo,allowModifyType:o.Ocr.AllowModifyType},livingbody:{silentRecordTime:o.LiveFour1V1.MaxDuration},success:{successTitle:o.Success.SubTipsName,successTips:o.Success.SuccessTips,isAutoSkip:o.Success.AutoSkip},sms:{},failpage:{isShowExitBtn:o.Fail.IsShowQuitBtn,exitBtnTtile:o.Fail.ExitBtnText,RetryBtnText:o.Fail.RetryBtnText}},runEnv:"release",navTitle:{smsTitle:o.Common.NavTitle.SmsTitle,ocrTitle:o.Common.NavTitle.OcrTitle,livingbodyTitle:o.Common.NavTitle.LivingbodyTitle,resultTitle:o.Common.NavTitle.ResultTitle},justForJumpVer:{title:o.Common.Title},about:{title:"关于腾讯云慧眼",content:"腾讯云慧眼由腾讯AI Lab、腾讯优图、腾讯数据平台部提供技术支持。"},isGetUserLocation:o.Index.IsGetLocation,isHideSmsPage:t,isHideOcrPage:n,livingbodyType:a,isJustOcr:r,isJustSms:s,failInfo:o.Fail.CustomFailInfo};var c={isHideSmsPage:d.isHideSmsPage,isHideOcrPage:d.isHideOcrPage,isJustSms:d.isJustSms,isJustOcr:d.isJustOcr,navTitle:d.navTitle};if(d.skipConfig=c,0!==d.livingbodyType&&1!==d.livingbodyType){var f=4,u=d.page.livingbody.silentRecordTime;u&&"number"==typeof u&&u>4&&(f=u),d.page.livingbody.silentRecordTime=f}let g=d.page.ocr.allowModifyType.split("");return d.page.ocr.isIdnameAllowEdit="0"===g[0],d.page.ocr.isIdnumberAllowEdit="0"===g[1],d.page.ocr.isIdaddressAllowEdit="0"===g[2],console.log(d.page.ocr),d};module.exports={init:init};