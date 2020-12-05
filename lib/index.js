"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bilibili_live_ws_1 = require("bilibili-live-ws");
const src_1 = require("bilibili-live-ws/src");
const net_1 = require("net");
const typedi_1 = require("typedi");
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
const insert2Databse = require('./database.js');
const ROOM_ID = 280446;
const PORT = 17000;
var colors = require('colors');
var DateInfo = new Date();
var TimeString = DateInfo.toLocaleTimeString();
function main() {
    const server = net_1.createServer();
    typedi_1.Container.set('server', server);
    const clients = new Set();
    typedi_1.Container.set('clients', clients);
    server.on('connection', (socket) => {
        console.log('客户端连接');
        clients.add(socket);
        socket.on('close', () => {
            console.log('客户端断开连接');
            clients.delete(socket);
        });
        socket.on('error', console.error);
    });
    server.listen(PORT);
    const live = new src_1.KeepLiveTCP(ROOM_ID);
    typedi_1.Container.set(bilibili_live_ws_1.LiveTCP, live);
    live.on('live', () => console.log('['+colors.red(TimeString)+']'+colors.brightGreen('连接到直播间')+colors.red(ROOM_ID)+colors.brightGreen('成功!!')));
    const buffer = [];
    typedi_1.Container.set('buffer', buffer);
    let online = 0;
    live.on('heartbeat', (e) => online = e);
    live.on('msg', (msg) => {
		var DateInfo = new Date();
		var cointype = '银瓜子';
		var TimeString = DateInfo.toLocaleTimeString();
        buffer.push(msg);
		//console.log (msg.cmd);
		switch(msg.cmd){
			
			case 'DANMU_MSG':
			//收到普通弹幕
			//console.log(msg);
			insert2Databse.insertDanmu(msg);
				console.log('['+colors.red(TimeString)+']'+colors.brightGreen(msg.info[2][1])+':'+colors.brightMagenta(msg.info[1]));
			break;
			
			case 'INTERACT_WORD':
			//用户进入直播间消息
			   console.log(msg);
			   console.log('['+colors.red(TimeString)+']'+colors.white(msg.data.uname)+colors.brightGreen('进入了直播间'));
			break;
			
			case 'SEND_GIFT':
			//礼物被发送后的消息
			//console.log(msg);
			//insert2Databse.insertGift(msg);
			//insert2Databse.updateGiftinfo(msg);
			    if (msg.data.coin_type == 'silver'){
					 cointype = '银瓜子';
				}else {
					 cointype ='金瓜子';
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
			    console.log('['+colors.red(TimeString)+']'+'信息更新:粉丝数'+colors.brightGreen(msg.data.fans)+',粉丝团成员数'+colors.brightRed(msg.data.fans_club)+'当前房间人气'+colors.brightYellow(online));
				//insert2Databse.insertData(msg,online);
				//console.log(msg);
			break;
			
			case 'SUPER_CHAT_MESSAGE':
			//醒目留言消息
			    insert2Databse.insertSuperchat(msg);
			    console.log (msg);
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
			    //console.log(msg);
			console.log('['+colors.red(TimeString)+']'+'天选抽奖开始，奖励'+colors.brightGreen(msg.data.award_name)+'数量'+colors.brightRed(msg.data.award_num));
			break;
			
			case 'ANCHOR_LOT_END':
			//天选之人获奖信息
			    //console.log (msg);
			console.log('['+colors.red(TimeString)+']'+'天选抽奖结束');
			console.log(msg.data.award_users);
			break;
			
			case 'ANCHOR_LOT_AWARD':
			    console.log(msg);
			break;
			
			case 'GUARD_BUY':
			//上舰长的消息
			    //console.log(msg);
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
			    //console.log(msg);
			break;
		}

    });
    live.on('error', console.error);
    function doSend() {
        if (buffer.length !== 0) {
            const body = {
                info: {
                    room: ROOM_ID,
                    time: ~~(Date.now() / 1000),
                    viewers: online,
                },
                data: buffer,
            };
            const json = JSON.stringify(body);
            const clients = typedi_1.Container.get('clients');
			//console.log(json);
            for (const client of clients.values()) {
                client.write(json);
            }
            buffer.length = 0;
        }
        //setTimeout(doSend, 1000);
    }
    //setTimeout(doSend, 1000);
}

main();
//# sourceMappingURL=index.js.map
