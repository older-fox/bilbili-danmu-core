var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
var TimeString = DateInfo.toLocaleTimeString();
exports.insertDanmu = insertDanmu;
exports.insertGift = insertGift;
exports.insertData = insertData;
exports.insertSuperchat = insertSuperchat;
exports.updateGiftinfo = updateGiftinfo;
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

function updateGiftinfo(info){
	pool.getConnection(function(err,connection){
	var timestring = Date.now()/1000;
	const sql = "SELECT * FROM `gift_info` WHERE `uid` = "+info.data.uid
	connection.query(sql,function(err,results){
		if (err){
			console.log('执行数据库命令时发生错误'+err.stack);
			return;
		}

		if (results[0]== undefined){
			if (info.data.coin_type == 'silver'){
				var sql = "INSERT INTO `gift_info` (`Id`, `uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.uname+"', '"+info.data.num+"', '"+info.data.price+"', '0', '0', '0', '0', '"+timestring+"')"
			}else {
				var sql = "INSERT INTO `gift_info` (`Id`, `uid`, `username`, `gift_count`, `silver_count`, `gold_count`, `biggest_gift`, `biggest_gift_name`, `biggest_gift_count`, `update_time`) VALUES (NULL, '"+info.data.uid+"', '"+info.data.uname+"', '"+info.data.num+"', '0', '"+info.data.price+"', '0', '0', '0', '"+timestring+"')"
			}
			connection.query(sql,function(err,results){
				if (err){
					console.log('执行数据库命令时发生错误'+err.stack);
					return;
			}
			})

		}else{
			var userinfo = results[0]
			var gift_count = info.data.num + userinfo.gift_count;
			
			if (info.data.coin_type == 'silver'){
			    var silver_count = info.data.price + userinfo.silver_count;
			    var gold_count = userinfo.gold_count;
			}else {
			    var silver_count = userinfo.silver_count;
				var gold_count = userinfo.gold_count + info.data.price;
			}
			
			if (info.data.coin_type == 'gold' && info.data.price > userinfo.biggest_gift){
				var biggest_gift = info.data.price;
				var biggest_gift_name = info.data.giftName;
				var biggest_gift_count = info.data.num;
			}else {
				var biggest_gift = userinfo.biggest_gift;
				var biggest_gift_name = userinfo.biggest_gift_name;
				var biggest_gift_count = userinfo.biggest_gift_count;
			}
			var sql = "UPDATE `gift_info` SET `gift_count` = '"+gift_count+"', `silver_count` = '"+silver_count+"', `gold_count` = '"+gold_count+"', `biggest_gift` = '"+biggest_gift+"', `biggest_gift_name` = '"+biggest_gift_name+"', `biggest_gift_count` = '"+biggest_gift_count+"', `update_time` = '"+timestring+"' WHERE `gift_info`.`Id` = "+userinfo.Id+";";
			
			connection.query(sql,function(err,results){
				if (err){
					console.log('数据库命令执行失败'+err.stack);
					return;
				}
			})
		}
	})
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
