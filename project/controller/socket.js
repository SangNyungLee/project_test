const {Chat, participant, room, Sequelize} = require('../models');
const Op = Sequelize.Op;
// const {room} = require('../models');

exports.connection = (io, socket) => {

   //진짜 입장하는 방번호
   let realNumber;
   socket.on("create", async (roomName, userid, mylist)=>{
    console.log("roomName", roomName)
    // findall 해서 내가 입장하려는 방이랑 내 닉네임으로 만들어진 곳이 있는지 찾기
    const userFind1 = await room.findAll({
        where : {
            [Op.and]: [
                { Name1: roomName },
                { Name2: userid },
                ],
        },
    })
    const userFind2 = await room.findAll({
        where : {
            [Op.and]: [
                { Name1: userid },
                { Name2: roomName },
                ],
        },
    })
    //roomNumber꺼내기
    if(userFind1.length > 0){
        userFind1.forEach(res=>{
            realNumber = res.roomNum
        })
    }
    if(userFind2.length > 0){
        userFind2.forEach(res=>{
            realNumber = res.roomNum
        })
    }
    //방이 없으면 방 만들어줌
    if(userFind1.length === 0 && userFind2.length === 0){
        console.log("방 만들어주는곳~~================")
        const createRoom = await room.create({
            Name1 : userid,
            Name2 : roomName
        })

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
    }else{
        //만약에 방이 있으면(채팅내용 불러오기)
        console.log("============방있으면 오는곳=================")
        //방이 있으면 join 시켜줌
        console.log("들어가는 방 번호", realNumber)
        socket.join(realNumber);
        //채팅내용은 방 번호로 (findAll해서) 전부 가져오기
        const chatMessage = await Chat.findAll({
            where:{roomNum : realNumber}
        });
        io.to(socket.id).emit("preMessage", chatMessage);
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
}