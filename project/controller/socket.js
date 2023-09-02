const {Chat} = require('../models');

exports.connection = (io, socket) => {
    //접속하면 자기 아이디(userid)으로 된 채팅방으로 접속
    socket.on("login_join",(userid)=>{
        //들어오면 바로 방 목록부터 체크
        // const roomList = 
        socket.join(userid)
        socket.userid = userid;
        console.log("유저아이디", socket.userid)
    })
    console.log("접속");
}