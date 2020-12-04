var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
var TimeString = DateInfo.toLocaleTimeString();
exports.insertDanmu = insertDanmu;
exports.insertGift = insertGift;
exports.insertData = insertData;
exports.insertSuperchat = insertSuperchat;
//定义区结束

var pool = mysql.createPool({
    host: 'localhost',
    user: 'stream',
    password: 'Limengwei990114.',
    database: 'stream'
});

function insertDanmu(danmu) {
    pool.getConnection(function(err, connection) {
        var timestring = Date.now() / 1000;
        var Uid = danmu.info[3][3];
        var Msg = danmu.info[1];
        Msg = Msg.replace(/'/g, "");
        if (Uid == undefined) {
            Uid = 0;
        }
        let sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + danmu.info[4][3] + "', '" + Msg + "', '" + timestring + "')";
        connection.query(sql,
        function(err, connection) {
            if (err) {
                console.error('执行数据库查询时发生错误' + err.stack);
                return;
            }
        });
        connection.release();
    });
}

function insertGift(gift) {
    pool.getConnection(function(err, connection) {
        var timestring = Date.now() / 1000;
        let sql = "INSERT INTO `gift_history` (`Id`, `uid`, `username`, `send_time`, `sent_count`, `coin_type`, `coin_count`, `gift_id`, `action`, `gift_name`) VALUES (NULL, '"+gift.data.uid+"', '"+gift.data.uname+"', '"+timestring+"', '"+gift.data.num+"', '"+gift.data.coin_type+"', '"+gift.data.total_coin+"', '"+gift.data.giftId+"', '"+gift.data.action+"', '"+gift.data.giftName+"')";
        connection.query(sql,
        function(err, connection) {
            if (err) {
                console.error('执行数据库命令时发生错误' + err.stack);
                return;
            }
        });
        connection.release();
    });
}


function insertData(info,online) {
    pool.getConnection(function(err, connection) {
        var timestring = Date.now() / 1000;
        let sql = "INSERT INTO `realTime_data` (`Id`, `fllowers`, `viewers`, `fans_club`, `upload_time`) VALUES (NULL, '"+info.data.fans+"', '"+online+"', '"+info.data.fans_club+"', '"+timestring+"')";
        connection.query(sql,function(err, connection) {
            if (err) {
                console.error('执行数据库命令时发生错误' + err.stack);
                return;
            }});
        connection.release();
    });
}


function insertAnchor (){
	pool.getConnection(function(err,connection){
		var timestring = Date.now()/1000;
		let sql = "";
		connection
	})
	
}


function insertSuperchat (info){
	pool.getConnection(function(err,connection){
		var timestring = Date.now()/1000;
		let sql = "INSERT INTO `superchat_info` (`Id`, `uid`, `message`, `price`, `send_time`) VALUES (NULL, '"+info.data.user_info.uid+"', '"+info.data.message+"', '"+info.data.price+"', '"+timestring+"')";
		connection.query(sql,function(err, connection) {
        if (err) {
            console.error('执行数据库命令时发生错误' + err.stack);
            return;
        }});
		connection.release();
	})
	
}

function updateGiftinfo(info,type){
	pool.getConnection(function(err,connection){
	var timestring = Date.now()/1000;
	
	connection.release();
	})
}


/**
connection.connect(function(err) {
	if (err) {
		console.error('在连接到数据库时发生错误'+err.stack);
		return;
	}
	console.log('['+colors.red(TimeString)+']'+colors.brightGreen('连接到数据库成功,套接ID')+colors.brightRed(connection.threadId));
});
**/
