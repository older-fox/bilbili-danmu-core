var colors = require('colors');
const TencentAI = require('tencent-ai-nodejs-sdk');

var DateInfo = new Date();



var Cookie = "LIVE_BUVID=AUTO7316101970276034; _uuid=86EC3599-0A8F-65CC-6651-341648E4EB1F30154infoc; buvid3=FF76975F-055F-4BFE-B7C7-3ADC7D1A43F018557infoc; sid=kpdnxw45; DedeUserID=449905159; DedeUserID__ckMd5=c21412e417211de2; SESSDATA=b84ab76a%2C1625749049%2C63c5c*11; bili_jct=814a54f7c31b916bd9c6939f7b5698e7; _dfcaptcha=2093d2b799b04bf58997d34010dfde69; PVID=3"
exports.GetAiReply = GetAiReply;
// NOTE: 此方法用于获取拼接完成后的URL，以Get方式提交到服务器。参数:uid作为会话标识（应用内唯一）,参数2作为提问信息
async function GetAiReply(uid,question) {
  const tencentAi = new TencentAI("2167095770", "Rv8r2gcUAAlGciYB",()=>uid);
  const result = await tencentAi.nlpTextChat(question)
  //console.log(result);
  if (result.ret == 0) {
    return(result.data.answer)
  }else {
    return ("请求出错");
  }
}
