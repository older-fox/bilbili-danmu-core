var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
exports.insertDanmu = insertDanmu;
exports.insertData = insertData;
exports.insertGift = insertGift;
exports.insertGuardbuy = insertGuardbuy;
exports.insertEntry = insertEntry;
exports.insertSuperchat = insertSuperchat;
//定义区结束

var pool = mysql.createPool({
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



//中间件-同步赠礼记录及瓜子统计
async function updateGiftinfo(uid,username,gift_num,coin_type,coin_count,gift_name){
	const timestring = Date.now() /1000;
	var connection = await getSqlhandel();
	var current = 0
	var sql = "SELECT * FROM `gift_info` WHERE `uid` = "+uid+";";
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
			   var current = 0
			}else{
				info = result[0];
               var current = info.biggest_gift;
			}
			if (coin_type == 'gold' & coin_count > current) {
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '0', '"+coin_count+"', '"+coin_count+"', '"+gift_name+"', '"+gift_num+"', '"+timestring+"') ON DUPLICATE KEY UPDATE `username` = '"+username+"', `gold_count` = gold_count + "+coin_count+", `biggest_gift` = "+coin_count+", `biggest_gift_name` = '"+gift_name+"', `biggest_gift_count` = "+gift_num+", `update_time` = "+timestring+";"
			}
			if (coin_type == 'silver'){
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '"+coin_count+"', '0', '"+coin_count+"', '"+gift_name+"', '"+gift_num+"', '"+timestring+"') ON DUPLICATE KEY UPDATE `username` = '"+username+"', `silver_count` = silver_count + "+coin_count+", `update_time` = "+timestring+";"
			}
			if (coin_type == 'gold' & coin_count <= current){
				var sql = "INSERT INTO `gift_info` (`uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`) VALUES ('"+uid+"', '"+username+"', '"+gift_num+"', '0', '"+coin_count+"', '"+coin_count+"', '"+gift_name+"', '"+gift_num+"', '"+timestring+"') ON DUPLICATE KEY UPDATE `username` = '"+username+"', `gold_count` = gold_count + "+coin_count+", `update_time` = "+timestring+";"
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


async function insertMedal(uid,username,title_name,title_level,title_owner_room){
	if (title_level == 0 ){
		return;
	}
	const timestring = Date.now() /1000;
	if (title_owner_room == 0){
	var sql = "INSERT INTO `title_info` (`uid`, `username`, `title_name`, `title_level`, `title_owner_room`, `update_time`) VALUES ('"+uid+"', '"+username+"', '"+title_name+"', '"+title_level+"', '"+title_owner_room+"', "+timestring+") ON DUPLICATE KEY UPDATE `title_name` = '"+title_name+"', `title_level` = "+title_level+", `update_time` = "+timestring+";";
	}else {
	var sql = "INSERT INTO `title_info` (`uid`, `username`, `title_name`, `title_level`, `title_owner_room`, `update_time`) VALUES ('"+uid+"', '"+username+"', '"+title_name+"', '"+title_level+"', '"+title_owner_room+"', "+timestring+") ON DUPLICATE KEY UPDATE `title_name` = '"+title_name+"', `title_level` = "+title_level+", `title_owner_room` = "+title_owner_room +", `update_time` = "+timestring+";";
	}
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
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
	await insertMedal(gift.data.uid,gift.data.uname,gift.data.medal_info.medal_name,gift.data.medal_info.medal_level,0)
}

//更新实时房间信息
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
	await insertMedal(danmu.info[2][0],danmu.info[2][1],danmu.info[3][1],danmu.info[3][0],danmu.info[3][3])
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
}