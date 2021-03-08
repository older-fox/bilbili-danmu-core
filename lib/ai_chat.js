const TencentAI = require('tencent-ai-nodejs-sdk');
exports.GetAiReply = GetAiReply;


// NOTE: 此方法用于获取拼接完成后的URL，以Get方式提交到服务器。参数:uid作为会话标识（应用内唯一）,参数2作为提问信息
async function GetAiReply(uid,question) {
  const tencentAi = new TencentAI("2167095770", "Rv8r2gcUAAlGciYB",()=>uid);
  const result = await tencentAi.nlpTextChat(question);
  //console.log(result);
  if (result.ret === 0) {
    return(result.data.answer)
  }else {
    return ("请求出错");
  }
}
