const got = require('got');
const colors = require('colors');
exports.GetUserId = GetUserId;
exports.GetFllowerCount = GetFllowerCount;
async function GetUserId(room_id) {// NOTE: 根据房间号获取该房间主播的uid
  const DateInfo = new Date();
  var TimeString = DateInfo.toLocaleTimeString();
  try {
    const result  = await got('https://api.live.bilibili.com/room/v1/Room/get_info?id='+room_id);
    const roomInfo = JSON.parse(result.body);
    return(roomInfo.data.uid);
  } catch (e) {
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }
  }


async function GetFllowerCount(roomid) {// NOTE: 获取该主播粉丝数量
  const DateInfo = new Date();
  var TimeString = DateInfo.toLocaleTimeString();
  try {
    const result  = await got("https://api.live.bilibili.com/room/v1/Room/get_info?id="+roomid);
    const roomInfo = JSON.parse(result.body);
    return(roomInfo.data.attention);
  } catch (e) {
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }
}
