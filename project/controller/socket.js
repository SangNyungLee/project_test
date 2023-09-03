const {Chat, participant, room} = require('../models');
// const {room} = require('../models');

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
   //진짜 입장하는 방번호
   let realNumber;
   socket.on("create", async (roomName, userid)=>{
    console.log("roomName", roomName)
    //newName = 내 닉네임 + 방이름 합친이름
    // findall 해서 내가 입장하려는 방이랑 내 닉네임으로 만들어진 곳이 있는지 찾기
    const newName = userid+roomName;
    //합친 방 이름이 있는지 검사
    const findName1 = await participant.findOne({
        where:{member_list : userid}
    })
    console.log("첫번째 찾은거 이름", findName1);
    const findName2 = await participant.findOne({
        where:{member_list : roomName}
    })  
    console.log("두번째 찾은거 이름", findName2);
    //방이 없으면 방 만들어줌
    if(findName1 == null || findName2 == null){
        console.log("방 만들어주는곳~~================")
        const createRoom = await room.create({
            createName : newName,
        })
        console.log("방번호뭐지??????", createRoom.roomNum);
        //멤버 리스트에 나(userid), 상대(roomName) 추가하기
        const participant1 = await participant.create({
            roomNum : createRoom.roomNum,
            member_list : userid
        })
        const participant2 = await participant.create({
            roomNum : createRoom.roomNum,
            member_list : roomName
        })        
        realNumber = createRoom.roomNum
        socket.join(realNumber);
    }else{//만약에 방이 있으면(채팅내용 불러오기)
        console.log("============방있으면 오는곳=================")
        console.log("내아이디", socket.id)
        //방 번호 저장
        realNumber = findName1.roomNum
        //방이 있으면 join 시켜줌
        console.log("newName", newName)
        console.log("들어가는 방 번호", realNumber)
        socket.join(realNumber);
        const chatMessage = await Chat.findAll();
        io.to(socket.id).emit("preMessage", chatMessage);
        chatMessage.forEach(row=>{
            console.log(`${row.send} : ${row.message}`);
        }) 
    }

    //socket.room에 방 이름 저장시켜둠
    socket.room = realNumber;
   })

   //메세지 보내기
   socket.on("sendMessage",async (message,userid)=>{
    io.to(socket.room).emit("newMessage", message);
    //받은 메세지랑, 보낸사람 DB에 다 저장하기
    const chatval = await Chat.create({
        roomNum : realNumber,
        message : message,
        send : userid,
    })
   });

   //방 만들기

}