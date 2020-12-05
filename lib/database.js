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
	const sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + danmu.info[4][3] + "', '" + Msg + "', '" + timestring + "')";
	await pool.query(sql);
}


//更新实时房间信息
async function insertData (info,online){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `realTime_data` (`Id`, `fllowers`, `viewers`, `fans_club`, `upload_time`) VALUES (NULL, '"+info.data.fans+"', '"+online+"', '"+info.data.fans_club+"', '"+timestring+"')";
	await pool.query(sql);
}

//插入礼物实时消息
async function insertGift (gift){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `gift_history` (`Id`, `uid`, `username`, `send_time`, `sent_count`, `coin_type`, `coin_count`, `gift_id`, `action`, `gift_name`) VALUES (NULL, '"+gift.data.uid+"', '"+gift.data.uname+"', '"+timestring+"', '"+gift.data.num+"', '"+gift.data.coin_type+"', '"+gift.data.total_coin+"', '"+gift.data.giftId+"', '"+gift.data.action+"', '"+gift.data.giftName+"')";
	await pool.query(sql);
}

//插入醒目留言相关信息
async function insertSuperchat (info){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `superchat_info` (`Id`, `uid`, `username`, `message`, `price`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.user_info.uname+"', '"+info.data.message+"', '"+info.data.price+"', '"+timestring+"')";
	await pool.query(sql);
}

//插入舰长购买的相关信息
async function insertGuardbuy (info){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `guard_info` (`Id`, `uid`, `username`, `guard_level`, `price`, `num`, `send_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.username+"', '"+info.data.guard_level+"', '"+info.data.price+"', '"+info.data.num+"', '"+timestring+"')";
	await pool.query(sql);
}


//插入房间进入日志
async function insertEntry (info){
	const timestring = Date.now() /1000;
	const sql = "INSERT INTO `entry_info` (`Id`, `uid`, `username`, `entry_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.uname+"', '"+timestring+"')";
	await pool.query(sql);
}