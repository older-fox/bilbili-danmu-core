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

//插入弹幕实时消息
async function insertDanmu (danmu){
	const timestring = Date.now() /1000;
	let Uid = danmu.info[3][3];
	let Msg = danmu.info[1].replace(/'/g, "");
	if (Uid == undefined) {Uid = 0;}
	var sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + danmu.info[4][3] + "', '" + Msg + "', '" + timestring + "')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//更新观众活动记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+danmu.info[2][0]+",'"+danmu.info[2][1]+"',"+timestring+", "+timestring+", 0, 1, 'Send Danmu', 0) ON DUPLICATE KEY UPDATE danmu_count = danmu_count +1, laste_active = "+timestring;
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}


//更新实时房间信息
async function insertData (info,online){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `realTime_data` (`Id`, `fllowers`, `viewers`, `fans_club`, `upload_time`) VALUES (NULL, '"+info.data.fans+"', '"+online+"', '"+info.data.fans_club+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}

//插入礼物实时消息
async function insertGift (gift){
	const timestring = Date.now() /1000;
	//更新观众活动记录-礼物计数
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+gift.data.uid+",'"+gift.data.uname+"',"+timestring+", "+timestring+", 0, 0,'Send Gift', 1) ON DUPLICATE KEY UPDATE  gift_count = gift_count +1, laste_active = "+timestring+", laste_activety='Send Gift'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//插入日志
	var sql = "INSERT INTO `gift_history` (`Id`, `uid`, `username`, `send_time`, `sent_count`, `coin_type`, `coin_count`, `gift_id`, `action`, `gift_name`) VALUES (NULL, '"+gift.data.uid+"', '"+gift.data.uname+"', '"+timestring+"', '"+gift.data.num+"', '"+gift.data.coin_type+"', '"+gift.data.total_coin+"', '"+gift.data.giftId+"', '"+gift.data.action+"', '"+gift.data.giftName+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}

//插入醒目留言相关信息
async function insertSuperchat (info){
	const timestring = Date.now() /1000;
	var message = info.data.message;
	message = message.replace(/'/g, "");
	//更新观众活动记录-醒目留言按照弹幕记录
	var sql = "INSERT INTO `viewers_info` (`uid`, `username`, `first_active`, `laste_active`, `entry_times`, `danmu_count`, `laste_activety`, `gift_count`) VALUES ("+info.data.uid+",'"+info.data.uname+"',"+timestring+", "+timestring+", 0, 1,'Send Super Chat', 1) ON DUPLICATE KEY UPDATE danmu_count = danmu_count +1, gift_count = gift_count +1, laste_active = "+timestring+", laste_activety='Send Super Chat'";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
	//插入SuperChat的相关消息
	var sql = "INSERT INTO `superchat_info` (`Id`, `uid`, `username`, `message`, `price`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.user_info.uname+"', '"+message+"', '"+info.data.price+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
}

//插入舰长购买的相关信息
async function insertGuardbuy (info){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `guard_info` (`Id`, `uid`, `username`, `guard_level`, `price`, `num`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.username+"', '"+info.data.guard_level+"', '"+info.data.price+"', '"+info.data.num+"', '"+timestring+"')";
	await pool.query(sql,function(err){if (err){console.log(err.message);}});
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