const got = require('got');
const colors = require('colors');
const DateInfo = new Date();
exports.GetRoomInfo = GetRoomInfo;

async function GetRoomInfo(room_id) {
  var TimeString = DateInfo.toLocaleTimeString();
  var test = GetUserId(room_id);
  test.then(function(number){
    //console.log(number);
  })
  }


async function GetUserId(room_id) {
  
  return (room_id);
}
