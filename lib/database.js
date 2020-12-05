var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
exports.insertDanmu = insertDanmu;
//定义区结束

var pool = mysql.createPool({
    host: 'localhost',
    user: 'stream',
    password: 'Limengwei990114.',
    database: 'stream'
});


async function insertDanmu (danmu){
	const timestring = Date.now() /1000;
	var Uid = danmu.info[3][3];
	var Msg = danmu.info[1].replace(/'/g, "");
	if (Uid == undefined) {Uid = 0;}
	const sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + danmu.info[4][3] + "', '" + Msg + "', '" + timestring + "')";
	await pool.query(sql);
}

