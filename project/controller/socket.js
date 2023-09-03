const {Chat} = require('../models');

exports.connection = (io, socket) => {
    /*
    //접속하면 자기 아이디(userid)으로 된 채팅방으로 접속
    socket.on("login_join",(userid)=>{
        //들어오면 바로 방 목록부터 체크
        // const roomList = 
        socket.join(userid)
        socket.userid = userid;
        console.log("유저아이디", socket.userid)
    })
    */
   socket.on("create", (roomName, name)=>{
    console.log("roomName", roomName)
    socket.join(roomName);
    socket.room = roomName;
   })

   //메세지 보내기
   socket.on("sendMessage",async (message,userid)=>{
    io.to(socket.room).emit("newMessage", message);
    //받은 메세지랑, 보낸사람 DB에 다 저장하기
    await Chat.create({
        userid : userid,
        chat: message,
    })
   });
}