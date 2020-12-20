const got = require('got');
const colors = require('colors');
exports.GetUserId = GetUserId;
exports.GetFollowerCount = GetFollowerCount;
exports.GetNewFollower = GetNewFollower;
exports.GetFullVideos = GetFullVideos;


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


async function GetFullVideos(uid,pageSize) {
  const DateInfo = new Date();
  var TimeString = DateInfo.toLocaleTimeString();
  try {
    const result  = await got("https://api.bilibili.com/x/space/arc/search?mid="+uid+"&pn=1&ps=1&jsonp=jsonp");// NOTE: 该API接口有访问限制，安全访问次数为一分钟一次
    const videosInfo = JSON.parse(result.body);
    var videoList = [];
    const videoCount = videosInfo.data.page.count;// NOTE: 获取总视频数量
    const needPages = Math.ceil(videoCount/pageSize)+1;
    for (var i = 0; i < needPages; i++) {
      var pageResult = await GetVideoByOptions(i+1,50,uid);
      if (pageResult != -1) {
        var splite = JSON.parse(pageResult);
        for (var spliteCount = 0; spliteCount < splite.length; spliteCount++) {
          videoList.push(splite[spliteCount]);
        }
      }else {
        console.log('['+colors.red(TimeString)+']'+colors.brightRed('在访问视频列表时出现错误,当前访问页数:')+colors.brightYellow(i));
        return(-1)
      }
    }// NOTE: 循环结束

    return (JSON.stringify(videoList));// NOTE: 发回结果
  } catch (e) {
    console.error(e);
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('访问视频列表时出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }

}


async function GetVideoByOptions(pn,ps,uid) {
  const DateInfo = new Date();
  var TimeString = DateInfo.toLocaleTimeString();
  try {
    const result  = await got("https://api.bilibili.com/x/space/arc/search?mid="+uid+"&pn="+pn+"&ps="+ps+"&jsonp=jsonp");// NOTE: 该API接口有访问限制，安全访问次数为一分钟一次
    const videosInfo = JSON.parse(result.body);
    var videoList = [];
    var videoCount = videosInfo.data.page.count;
    for (var i = 0; i < videosInfo.data.list.vlist.length; i++) {
      videoList.push(videosInfo.data.list.vlist[i]);
    }
    return(JSON.stringify(videoList));
  } catch (e) {
    console.error(e);
    const errorInfo = JSON.parse(e.response.body);
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('访问视频列表时出现异常错误,错误信息:')+colors.brightYellow(errorInfo.message));
    return(-1);
  }
}
