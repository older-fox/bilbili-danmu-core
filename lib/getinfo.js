const got = require('got');
const colors = require('colors');
exports.GetUserId = GetUserId;
exports.GetFollowerCount = GetFollowerCount;
exports.GetNewFollower = GetNewFollower;


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


async function GetFollowerCount(roomid) {// NOTE: 获取该主播粉丝数量
  const DateInfo = new Date();
  var TimeString = DateInfo.toLocaleTimeString();
  try {
    const result  = await got("https://api.live.bilibili.com/room/v1/Room/get_info?id="+roomid);// NOTE: 该API接口有访问限制，安全访问次数为一分钟一次
    const roomInfo = JSON.parse(result.body);
    return(roomInfo.data.attention);
  } catch (e) {
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }
}

async function GetNewFollower(uid,timestring) {// NOTE: 获取新的关注者，uid=被检测者的uid,TimeString=后于该时间戳的关注者将被认为是新关注者
  try {
    const result  = await got("https://api.bilibili.com/x/relation/followers?vmid="+uid+"&pn=1&ps=50&order=desc&order_type=attention&jsonp=jsonp");// NOTE: 该API接口有访问限制，安全访问次数为一分钟一次
    const followerList = JSON.parse(result.body);
    var newFollower = [];
    for (var i = 0; i < followerList.data.list.length; i++) {// NOTE: 循环遍历一页中所有的关注者
      if(followerList.data.list[i].mtime > timestring){
        newFollower.push(followerList.data.list[i]);
      }
    }
    return(JSON.stringify(newFollower));
  } catch (e) {
    console.error(e);
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }
}
