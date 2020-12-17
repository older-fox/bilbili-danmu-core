var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
exports.insertDanmu = insertDanmu;
exports.insertData = insertData;
exports.insertGift = insertGift;
exports.insertGuardbuy = insertGuardbuy;
exports.insertEntry = insertEntry;
exports.insertSuperchat = insertSuperchat;
exports.insertFullTimeRecord = insertFullTimeRecord;
exports.insertNewFollowers = insertNewFollowers;
//定义区结束

var pool = mysql.createPool({
	connectionLimit:300,
    host: 'localhost',
    user: 'stream',
    password: 'Limengwei990114.',
    database: 'stream'
});


function getSqlhandel(){//修正async的connection获取问题
	return new Promise (function (resolve,reject){
		pool.getConnection(function (err,connection){
			if (err){
				console.log("出现数据库错误"+err.message);
				reject(error);
			}else{
				resolve(connection);
			}
		})
	})
}



async function updateDailyViwerInfo(uid,username,action_type,gift_num) {// NOTE: 更新每日观众统计到数据表中
	const timestring = Date.now() /1000;
	var connection = await getSqlhandel();
	switch (action_type) {
		case 'send_gift':// NOTE: 如果操作类型为礼物赠送
			var sql = "INSERT INTO `daily_viewers_info` (`uid`, `username`, `entry_times`, `danmu_count`, `gift_count`, `laste_activety`, `record_date`) VALUES ('"+uid+"', '"+username+"', '0', '0', '"+gift_num+"', 'Send Gift', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `laste_activety` = 'Send Gift' ,"+"`gift_count`= gift_count +"+gift_num;
			break;
		case 'send_danmu':// NOTE: 如果操作类型为弹幕发送
			var sql = "INSERT INTO `daily_viewers_info` (`uid`, `username`, `entry_times`, `danmu_count`, `gift_count`, `laste_activety`, `record_date`) VALUES ('"+uid+"', '"+username+"', '0', '1', '0', 'Send Danmu', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `laste_activety` = 'Send Danmu' ,"+"`danmu_count`= danmu_count + 1";
			break;
		case 'join_room':// NOTE: 如果操作类型为进入房间
			var sql = "INSERT INTO `daily_viewers_info` (`uid`, `username`, `entry_times`, `danmu_count`, `gift_count`, `laste_activety`, `record_date`) VALUES ('"+uid+"', '"+username+"', '1', '0', '0', 'Join Room', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `laste_activety` = 'Join Room' ,"+"`entry_times`= entry_times + 1";
			break;
			}
	connection.query(sql,function (err) {
		if (err) {
			console.log("执行每日观众信息更新时出现错误"+err.message);
			connection.release();
		}
	})
	connection.release();
	}


async function updateDailyGiftInfo(uid,username,giftnum,coin_type,coin_count,gift_name) {//更新每日的用户统计信息
	const timestring = Date.now() /1000;
	var connection = await getSqlhandel();
	var current = 0
	var sql = "SELECT * FROM `daily_gift_info` WHERE `uid` = "+ uid +";";
	var info = "";
	connection.beginTransaction(function(err){
		if (err){
		console.log("事务启动失败"+err.message);
		connection.release();
		return;
	}})
	connection.query(sql,function(err,result){
		if(err){
			console.log("数据库查询失败"+err.message);
			connection.commit();
			connection.release();
			return;
		}else{
			if (result[0] == undefined){//数据库中暂时不存在这一用户的记录
			   var current = -1
			}else{
				info = result[0];
               var current = info.biggest_gift;
			}
			if (coin_type == "gold" && coin_count > current) {
				var sql = "INSERT INTO `daily_gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `record_date`) VALUES ('"+uid+"', '"+username+"', '"+giftnum+"', '0', '"+coin_count+"', '"+coin_count+"', '"+gift_name+"', '"+giftnum+"', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `gold_count` = gold_count +" + coin_count + ",gift_count = gift_count + "+giftnum+",biggest_gift = "+coin_count+",biggest_gift_name = '"+gift_name+"', biggest_gift_count="+giftnum+";"
			}
			if (coin_type == "silver"){
				var sql = "INSERT INTO `daily_gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `record_date`) VALUES ('"+uid+"', '"+username+"', '"+giftnum+"', '"+coin_count+"', '0', '0', '0', '0', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `silver_count` = silver_count + "+coin_count+",gift_count = gift_count + "+giftnum+";"
			}
			if (coin_type == "gold" && coin_count <= current){// NOTE: 此处SQL语句可以缩短，但懒得写
				var sql = "INSERT INTO `daily_gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `record_date`) VALUES ('"+uid+"', '"+username+"', '"+giftnum+"', '0', '0', '0', '0', '0', DATE_FORMAT(NOW(),'%Y-%m-%d')) ON DUPLICATE KEY UPDATE `gold_count` = gold_count + "+coin_count+",gift_count = gift_count + "+giftnum+";"
			}
			connection.query(sql,function(err){
				if(err){
					console.log("插入/更新执行失败"+err.message);
					connection.rollback();
				}
			})
		}
	})
	connection.commit();
	connection.release();
}



//中间件-同步赠礼记录及瓜子统计
async function updateGiftinfo(uid,username,gift_num,coin_type,coin_count,gift_name){
	const timestring = Date.now() /1000;
	var connection = await getSqlhandel();
	var current = 0
	var sql = "SELECT * FROM `gift_info` WHERE `uid` = "+uid+";";
	connection.beginTransaction(function(err){
		if (err){
		console.log("事务启动失败"+err.message);
		connection.release();
		return;
	}})
	connection.query(sql,function(err,result){
		if(err){
			console.log("数据库查询失败"+err.message);
			connection.commit();
			connection.release();
			return;
		}else{
			if (result[0] == undefined){//数据库中暂时不存在这一用户的记录
			   var current = -1
			}else{
				info = result[0];
               var current = info.biggest_gift;
			}
			if (coin_type == "gold" && coin_count > current) {
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`, `record_update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '0', '"+coin_count+"', '"+coin_count+"', '"+gift_name+"', '"+gift_num+"', '"+timestring+"', '"+timestring+"') ON DUPLICATE KEY UPDATE `record_update_time` = "+timestring+", `gift_count` = gift_count + "+gift_num+", `username` = '"+username+"', `gold_count` = gold_count + "+coin_count+", `biggest_gift` = "+coin_count+", `biggest_gift_name` = '"+gift_name+"', `biggest_gift_count` = "+gift_num+", `update_time` = "+timestring+";"
			}
			if (coin_type == "silver"){
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`, `record_update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '"+coin_count+"', '0', '0', '0', '0', '"+timestring+"',0) ON DUPLICATE KEY UPDATE `gift_count` = gift_count + "+gift_num+", `username` = '"+username+"', `silver_count` = silver_count + "+coin_count+", `update_time` = "+timestring+";"
			}
			if (coin_type == "gold" && coin_count <= current){// NOTE: 此处SQL语句可以缩短，但我懒得弄
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`, `record_update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '0', '"+coin_count+"', '0', '0', '0', '"+timestring+"',0) ON DUPLICATE KEY UPDATE `gift_count` = gift_count + "+gift_num+", `username` = '"+username+"', `gold_count` = gold_count + "+coin_count+", `update_time` = "+timestring+";"
			}
			connection.query(sql,function(err){
				if(err){
					console.log("插入/更新执行失败"+err.message);
					connection.rollback();
				}
			})
		}
	})
	connection.commit();
	connection.release();
	// NOTE: 顺便把这一堆玩意儿扔到每日礼物统计表中
	updateDailyGiftInfo(uid,username,gift_num,coin_type,coin_count,gift_name);
	updateDailyViwerInfo(uid,username,"send_gift",gift_num)// NOTE: 顺便同步进每日用户统计表
}


async function insertMedal(uid,username,title_name,title_level,title_owner_room,title_owner_uid){
	if (title_level == 0 || title_owner_uid == 0 || title_level == undefined){//若传参信息不完整
		return;//拒绝执行
	}
	const timestring = Date.now() /1000;
	let fix= title_name.replace(/'/g, "");//修正特殊字符导致的报错
	if (title_owner_room == 0){
	var sql = "INSERT INTO `title_info` (`uid`, `username`, `title_name`, `title_level`, `title_owner_room`, `update_time`, `title_owner_uid`) VALUES ('"+uid+"', '"+username+"', '"+fix+"', '"+title_level+"', '"+title_owner_room+"', "+timestring+", "+title_owner_uid+") ON DUPLICATE KEY UPDATE `title_owner_uid` = "+title_owner_uid+", `title_name` = '"+fix+"', `title_level` = "+title_level+", `update_time` = "+timestring+";";
	}else {
	var sql = "INSERT INTO `title_info` (`uid`, `username`, `title_name`, `title_level`, `title_owner_room`, `update_time`, `title_owner_uid`) VALUES ('"+uid+"', '"+username+"', '"+fix+"', '"+title_level+"', '"+title_owner_room+"', "+timestring+", "+title_owner_uid+") ON DUPLICATE KEY UPDATE `title_owner_uid` = "+title_owner_uid+", `title_name` = '"+fix+"', `title_level` = "+title_level+", `title_owner_room` = "+title_owner_room +", `update_time` = "+timestring+";";
	}
	await pool.query(sql,function(err){if (err){console.log(err.message);console.log(sql);}});
}


//插入礼物实时消息
async function insertGift (gift){
	const timestring = Date.now() /1000;
	//更新观众活动记录-礼物计数
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+gift.data.uid+",'"+gift.data.uname+"',"+timestring+", "+timestring+", 0, 0,'Send Gift', 1) ON DUPLICATE KEY UPDATE  gift_count = gift_count +"+gift.data.num+", laste_active = "+timestring+", laste_activety='Send Gift'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//插入日志
	var sql = "INSERT INTO `gift_history` (`Id`, `uid`, `username`, `send_time`, `sent_count`, `coin_type`, `coin_count`, `gift_id`, `action`, `gift_name`) VALUES (NULL, '"+gift.data.uid+"', '"+gift.data.uname+"', '"+timestring+"', '"+gift.data.num+"', '"+gift.data.coin_type+"', '"+gift.data.total_coin+"', '"+gift.data.giftId+"', '"+gift.data.action+"', '"+gift.data.giftName+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//计入瓜子儿统计库
	await updateGiftinfo(gift.data.uid,gift.data.uname,gift.data.num,gift.data.coin_type,gift.data.total_coin,gift.data.giftName)
	//计入勋章库
	await insertMedal(gift.data.uid,gift.data.uname,gift.data.medal_info.medal_name,gift.data.medal_info.medal_level,0,gift.data.medal_info.target_id)
}

//更新实时房间信息-直播状态消息
async function insertData (info,online){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `realTime_data` (`Id`, `fllowers`, `viewers`, `fans_club`, `upload_time`) VALUES (NULL, '"+info.data.fans+"', '"+online+"', '"+info.data.fans_club+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}


//插入弹幕实时消息
async function insertDanmu (danmu){
	const timestring = Date.now() /1000;
	let Uid = danmu.info[3][3];
	let Msg = danmu.info[1].replace(/'/g, "");
	if (Uid == undefined) {Uid = 0;}
	var level = danmu.info[4][3];
    if (level == ">50000"){level = '50000';}//修正非整数问题
	//更新观众活动记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+danmu.info[2][0]+",'"+danmu.info[2][1]+"',"+timestring+", "+timestring+", 0, 1, 'Send Danmu', 0) ON DUPLICATE KEY UPDATE danmu_count = danmu_count +1, laste_active = "+timestring+", laste_activety='Send Danmu'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//加入弹幕信息到弹幕历史表
	var sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + level + "', '" + Msg + "', '" + timestring + "')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//计入勋章库
	await insertMedal(danmu.info[2][0],danmu.info[2][1],danmu.info[3][1],danmu.info[3][0],danmu.info[3][3],danmu.info[3][12])
	//计入每日观众统计信息
	await updateDailyViwerInfo(danmu.info[2][0],danmu.info[2][1],"send_danmu")
}


//插入醒目留言相关信息
async function insertSuperchat (info){
	const timestring = Date.now() /1000;
	var message = info.data.message;
	message = message.replace(/'/g, "");
	//更新观众活动记录-醒目留言按照弹幕记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+info.data.uid+",'"+info.data.user_info.uname+"',"+timestring+", "+timestring+", 0, 1,'Send Super Chat', 1) ON DUPLICATE KEY UPDATE danmu_count = danmu_count +1, gift_count = gift_count +1, laste_active = "+timestring+", laste_activety='Send Super Chat'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//插入SuperChat的相关消息
	var sql = "INSERT INTO `superchat_info` (`Id`, `uid`, `username`, `message`, `price`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.user_info.uname+"', '"+message+"', '"+info.data.price+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//计入瓜子儿统计库
	await updateGiftinfo(info.data.uid,info.data.user_info.uname,'1','gold',info.data.price*1000,'醒目留言');
	//计入勋章统计库-若勋章不为空的话
	if (info.data.medal_info.medal_name != undefined ) {
		await insertMedal(info.data.uid,info.data.user_info.uname,info.data.medal_info.medal_name,info.data.medal_info.medal_level,info.data.medal_info.anchor_roomid,info.data.medal_info.target_id)
	}
	//计入观众每日统计
	await updateDailyViwerInfo(info.data.uid,info.data.user_info.uname,"send_gift",1)
}

//插入舰长购买的相关信息
async function insertGuardbuy (info){
	const timestring = Date.now() /1000;
	//更新观众活动记录-舰长活动记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+info.data.uid+",'"+info.data.username+"',"+timestring+", "+timestring+", 0, 0, 'Send Gift', 1) ON DUPLICATE KEY UPDATE gift_count = gift_count +1, laste_active = "+timestring+", laste_activety='Guard Buy'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
    //舰长购买日志记录
	var sql = "INSERT INTO `guard_info` (`Id`, `uid`, `username`, `guard_level`, `price`, `num`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.username+"', '"+info.data.guard_level+"', '"+info.data.price+"', '"+info.data.num+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//计入瓜子儿统计库
	await updateGiftinfo(info.data.uid,info.data.username,info.data.num,'gold',info.data.price,'上舰');
	//计入每日统计
	await updateDailyViwerInfo(info.data.uid,info.data.username,"send_gift",1)
}


//插入房间进入日志
async function insertEntry (info){
	const timestring = Date.now() /1000;
	//更新观众活动记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+info.data.uid+",'"+info.data.uname+"',"+timestring+", "+timestring+", 1, 0,'Join Room', 0) ON DUPLICATE KEY UPDATE entry_times = entry_times +1, laste_active = "+timestring+", laste_activety='Join Room'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//插入活动日志
	var sql = "INSERT INTO `entry_info` (`Id`, `uid`, `username`, `entry_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.uname+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//尝试计入勋章统计库-若勋章不为空
	if (info.data.fans_medal.medal_name != undefined ) {
		await insertMedal(info.data.uid,info.data.uname,info.data.fans_medal.medal_name,info.data.fans_medal.medal_level,info.data.fans_medal.anchor_roomid,info.data.fans_medal.target_id)
	}
	//计入每日观众统计
	await updateDailyViwerInfo(info.data.uid,info.data.uname,"join_room")
}


async function insertFullTimeRecord (online,fans){// NOTE: 计入总体观众及粉丝数量
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `full_time_record` (`Id`, `fllower_count`, `viewer_count`, `upload_time`) VALUES (NULL, '"+fans+"', '"+online+"', "+timestring+")";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}


async function insertNewFollowers(uid,mtime,uname,vipType,vipDueDate,vipStatus) {// NOTE: uid=用户uid,mtime=关注时间,uname=用户名,vipType=1:月费大会员，2:年费大会员,vipDueDate=VIP到期时间,vipStatus=VIP是否有效 1=有效0=无效
	const	sql = "INSERT INTO `new_follower` (`Id`, `uid`, `username`, `mtime`, `vipType`, `vipDueDate`, `vipStatus`) VALUES (NULL, '"+uid+"', '"+uname+"', '"+mtime+"', '"+vipType+"', '"+vipDueDate+"', '"+vipStatus+"')"
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}
