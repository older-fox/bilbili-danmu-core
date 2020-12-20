"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bilibili_live_ws_1 = require("bilibili-live-ws");
const src_1 = require("bilibili-live-ws/src");
const typedi_1 = require("typedi");
const insert2Databse = require('./database.js');
const updateRoomInfo = require('./getinfo.js')
const colors = require('colors');
const onTimer = require('node-schedule');
var online = 0;//全局变量-直播在线人数
var uid = 0;//全局变量-主播UID
var last_update = 0;//全局变量-上次获取粉丝列表的时间
const ROOM_ID = 1521498;//全局变量-房间号

getBasicInfo();

async function getBasicInfo() {// NOTE: 尝试获取房间信息
  let DateInfo = new Date();
  let TimeString = DateInfo.toLocaleTimeString();
  uid = await updateRoomInfo.GetUserId(ROOM_ID);// NOTE: 尝试拉取主播UID
  if (uid == -1){
    console.log('['+colors.red(TimeString)+']'+colors.brightRed('程序初始化错误,无法成功获取主播UID，请检查网络或稍后再试'));
    return;//结束APP
  }else {
    infoGetTimer();// NOTE: 拉起定时任务-获取房间人数
    getNewFollowerTimer();// NOTE: 拉起定时任务-获取新关注的粉丝列表
    main();// NOTE: 拉起主程序及容器
  }
}

function getNewFollowerTimer() {// NOTE: 获取新关注的粉丝表
  onTimer.scheduleJob('30 * * * * *',async ()=>{
    if (last_update == 0){last_update = Math.round(Date.now() /1000);}
    var newFollowerList = await updateRoomInfo.GetNewFollower(uid,last_update);
    if (newFollowerList == -1){// NOTE: 上游程序无法获取到信息，返回-1
      console.log('['+colors.red(TimeString)+']'+colors.brightRed('无法获取到新关注的观众列表,网络可能出现异常或API暂时无法访问,请稍后再试!'));
      return;// NOTE: 取消执行
    }
    last_update = Math.round(Date.now() /1000);//更新时间戳到当前时间
    newFollowerList = JSON.parse(newFollowerList);
    var text = "";// NOTE: 初始化一个空的文本行用于暂存新粉丝列表
    for (var i = 0; i < newFollowerList.length; i++) {
      await insert2Databse.insertNewFollowers(newFollowerList[i].mid,newFollowerList[i].mtime,newFollowerList[i].uname,newFollowerList[i].vip.vipType,newFollowerList[i].vip.vipDueDate,newFollowerList[i].vip.vipStatus)// NOTE: 插入到数据库
      text = text.concat(" "+colors.brightRed(newFollowerList[i].uname));// NOTE: 拼接列表
    }
    let DateInfo = new Date();
    let TimeString = DateInfo.toLocaleTimeString();
    if(text !=""){console.log('['+colors.red(TimeString)+']'+colors.brightGreen('有新的粉丝关注:')+text);}// NOTE: 输出可视化新关注列表
  });
}

function infoGetTimer() {//定时获取房间的粉丝数及实时观众人数
  onTimer.scheduleJob('1 * * * * *',async ()=>{//每分钟获取一次信息
  let DateInfo = new Date();
  let TimeString = DateInfo.toLocaleTimeString();
  let fllowerCount = await updateRoomInfo.GetFollowerCount(ROOM_ID);
  if (fllowerCount == -1 ){return;}//若查询被屏蔽，则取消操作,防止插入无效数据
  await insert2Databse.insertFullTimeRecord(online,fllowerCount);// NOTE: 记录每分钟的粉丝及观众数变化
  console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('主动信息更新:粉丝数 ')+colors.brightYellow(fllowerCount)+colors.brightMagenta(' ,当前房间人气 ')+colors.brightRed(online));
  });
}


function main() {
    let DateInfo = new Date();
    var TimeString = DateInfo.toLocaleTimeString();
    const live = new src_1.KeepLiveTCP(ROOM_ID);
    typedi_1.Container.set(bilibili_live_ws_1.LiveTCP, live);
    live.on('live', () => console.log('['+colors.red(TimeString)+']'+colors.brightGreen('连接到直播间')+colors.brightRed(ROOM_ID)+colors.brightGreen('成功,归属用户编号')+colors.brightRed(uid)));
    live.on('heartbeat', (e) => online = e);
    live.on('msg', (msg) => {
    let DateInfo = new Date();
    let TimeString = DateInfo.toLocaleTimeString();
		switch(msg.cmd){

			case 'DANMU_MSG':
			//收到普通弹幕
			//console.log(msg);
			insert2Databse.insertDanmu(msg);
				console.log('['+colors.red(TimeString)+']'+colors.brightGreen(msg.info[2][1])+':'+colors.brightMagenta(msg.info[1]));
			break;

			case 'INTERACT_WORD':
			//用户进入直播间消息
			insert2Databse.insertEntry(msg);
			   console.log('['+colors.red(TimeString)+']'+colors.white(msg.data.uname)+colors.brightGreen('进入了直播间'));
			break;

			case 'SEND_GIFT':
			//礼物被发送后的消息
			//console.log(msg);
			insert2Databse.insertGift(msg);
			//insert2Databse.updateGiftinfo(msg);
			    if (msg.data.coin_type == 'silver'){
					 var cointype = '银瓜子';
				}else {
					 var cointype ='金瓜子';
				}
				if (msg.data.total_coin == 0){
					console.log('['+colors.red(TimeString)+']'+colors.brightGreen(msg.data.uname)+'赠送了'+colors.brightRed(msg.data.num)+'个'+colors.brightYellow(msg.data.giftName));
				}else {
					console.log('['+colors.red(TimeString)+']'+colors.brightGreen(msg.data.uname)+'赠送了'+colors.brightRed(msg.data.num)+'个'+colors.brightYellow(msg.data.giftName)+'价值'+colors.brightGreen(msg.data.total_coin)+cointype);
				}
			break;

			case 'WELCOME':
			//老爷进入消息
			    if (msg.data.svip == 1){
					console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('欢迎年费老爷')+colors.brightYellow(msg.data.uname)+colors.brightMagenta('进入直播间'));
				} else {
					console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('欢迎月费老爷')+colors.brightGreen(msg.data.uname)+colors.brightMagenta('进入直播间'));
				}
			break;

			case 'WIDGET_BANNER':
			//无效消息暂不处理
			    //console.log(msg);
			   //console.log ('特殊消息待分析');
			break;

			case 'ROOM_BANNER':
			//特殊消息暂不处理（房间顶部消息更新）
			    //console.log(msg);
			    //console.log('房间banner消息,待分析');
			break;

			case 'ENTRY_EFFECT':
			//进入房间效果-无特殊用处
			    //console.log (msg);
			    //console.log('['+colors.red(TimeString)+']'+colors.brightGreen(msg.data.copy_writing));
			break;

			case 'COMBO_SEND':
			//连击礼物赠送
			    //console.log ('礼物连击');
			    //console.log (msg);
			break;

			case 'WELCOME_GUARD':
			//大航海会员进入直播间
			    switch (msg.data.guard_level){
					case 1:
					console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('欢迎总督')+colors.brightRed(msg.data.username)+colors.brightMagenta('进入直播间'));
					break;

					case 2:
					console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('欢迎提督')+colors.brightYellow(msg.data.username)+colors.brightMagenta('进入直播间'));
					break;

					case 3:
					console.log('['+colors.red(TimeString)+']'+colors.brightMagenta('欢迎舰长')+colors.brightGreen(msg.data.username)+colors.brightMagenta('进入直播间'));
				}
			break;

			case 'ROOM_REAL_TIME_MESSAGE_UPDATE':
			//房间信息更新
			    console.log('['+colors.red(TimeString)+']'+'被动信息更新:粉丝数'+colors.brightGreen(msg.data.fans)+',粉丝团成员数'+colors.brightRed(msg.data.fans_club)+'当前房间人气'+colors.brightYellow(online));
				insert2Databse.insertData(msg,online);
			break;

			case 'SUPER_CHAT_MESSAGE':
			//醒目留言消息
			    insert2Databse.insertSuperchat(msg);
				console.log('['+colors.red(TimeString)+']'+'发送者'+colors.brightRed(msg.data.user_info.uname)+'内容:'+colors.brightRed(msg.data.message)+'醒目留言价值'+colors.brightYellow(msg.data.price)+'元');
				console.log('['+colors.red(TimeString)+']'+'发送者'+colors.brightRed(msg.data.user_info.uname)+'内容:'+colors.brightRed(msg.data.message)+'醒目留言价值'+colors.brightYellow(msg.data.price)+'元');
				console.log('['+colors.red(TimeString)+']'+'发送者'+colors.brightRed(msg.data.user_info.uname)+'内容:'+colors.brightRed(msg.data.message)+'醒目留言价值'+colors.brightYellow(msg.data.price)+'元');
			break;

			case 'SUPER_CHAT_MESSAGE_JPN':
			//醒目留言消息 与上面无区别所以忽略
			   //console.log (msg);
			break;

			case 'ANCHOR_LOT_START':
			//天选之人开始的完整信息
			console.log(msg);
			console.log('['+colors.red(TimeString)+']'+'天选抽奖开始，奖励'+colors.brightGreen(msg.data.award_name)+'数量'+colors.brightRed(msg.data.award_num));
			break;

			case 'ANCHOR_LOT_END':
			//天选之人获奖信息
			    //console.log (msg);
			console.log('['+colors.red(TimeString)+']'+colors.red("天选之人抽奖已经结束!!!"));
			console.log(msg.data.award_users[0]);
			break;

			case 'ANCHOR_LOT_AWARD':
			    console.log(msg);
			break;

			//上舰长的消息
			case 'GUARD_BUY':
				insert2Databse.insertGuardbuy(msg);
					switch (msg.data.guard_level){
					case 1:
					    console.log('['+colors.red(TimeString)+']'+'用户'+colors.brightGreen(msg.data.username)+'购买了'+colors.brightRed('总督'));
					break;

					case 2:
					    console.log('['+colors.red(TimeString)+']'+'用户'+colors.brightGreen(msg.data.username)+'购买了'+colors.brightYellow('提督'));
					break;

					case 3:
					    console.log('['+colors.red(TimeString)+']'+'用户'+colors.brightGreen(msg.data.username)+'购买了'+colors.brightGreen('舰长'));
					}
			        break;
			break;

			case 'USER_TOAST_MSG':
			//续费舰长消息
			    //console.log(msg);

			case 'NOTICE_MSG':
      //系统通知消息
      if (msg.msg_common == undefined ){return;}//若系统给与的显示消息为空，则拒绝执行防止报错
      let NOTICE_MSG = msg.msg_common.replace(/%/g, "");//修正百分号
      console.log('['+colors.red(TimeString)+']'+colors.brightRed(NOTICE_MSG));
			break;


      default:
      //console.log(msg);
      break;
		}

    });
    live.on('error', console.error);
}
//# sourceMappingURL=index.js.map
