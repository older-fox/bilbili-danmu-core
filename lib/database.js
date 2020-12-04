var mysql = require('mysql');
var colors = require('colors');
var DateInfo = new Date();
var TimeString = DateInfo.toLocaleTimeString();
exports.insertDanmu = insertDanmu;
exports.insertGift = insertGift;
//定义区结束

var pool = mysql.createPool({ //定义数据库连接信息
    host: 'localhost',
    user: 'stream',
    password: 'Limengwei990114.',
    database: 'stream'
});

function insertDanmu(danmu) { //功能模块-插入弹幕信息到数据库
    pool.getConnection(function(err, connection) {
        var timestring = Date.now() / 1000;
        var Uid = danmu.info[3][3];
        var Msg = danmu.info[1];
        Msg = Msg.replace(/'/g, ""); //防止因为'字符导致的条目插入失败
        if (Uid == undefined) {
            //防止用户未佩戴勋章导致的undefined :P 
            Uid = 0;
        }
        let sql = "INSERT INTO `danmu_info` (`Id`, `uid`, `username`, `title_id`, `ul_level`, `rank_level`, `message`, `upload_time`) VALUES (NULL, '" + danmu.info[2][0] + "', '" + danmu.info[2][1] + "', '" + Uid + "', '" + danmu.info[4][0] + "', '" + danmu.info[4][3] + "', '" + Msg + "', '" + timestring + "')";
        //这行命令又臭又长我知道的，别骂。
        connection.query(sql,
        function(err, connection) {
            if (err) {
                //输出错误
                console.error('执行数据库查询时发生错误' + err.stack);
                return;
            }
        });
        connection.release();
        //释放连接池
    });
}

function insertGift(gift) { //功能模块-插入礼物信息到数据库
    pool.getConnection(function(err, connection) {
        var timestring = Date.now() / 1000;
        let sql = "INSERT INTO `gift_history` (`Id`, `uid`, `username`, `send_time`, `sent_count`, `coin_type`, `coin_count`, `gift_id`, `action`, `gift_name`) VALUES (NULL, '"+gift.data.uid+"', '"+gift.data.uname+"', '"+timestring+"', '"+gift.data.num+"', '"+gift.data.coin_type+"', '"+gift.data.price+"', '"+gift.data.giftId+"', '"+gift.data.action+"', '"+gift.data.giftName+"')";
        //这行命令也是又臭又长的我知道,别骂
        connection.query(sql,
        function(err, connection) {
            if (err) {
                //输出错误
                console.error('执行数据库命令时发生错误' + err.stack);
                return;
            }

        });
        connection.release();
        //释放连接池
    });
}




function insertAnchor (){
	pool.getConnection(function(err,connection){
		var timestring = Date.now()/1000;
		let sql = "";
		connection
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
