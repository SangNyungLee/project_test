const {
  Chat,
  participant,
  room,
  Sequelize,
  connectList,
} = require("../models");
const Op = Sequelize.Op;
// const {room} = require('../models');

//내이름 저장
let myID;

//진짜 입장하는 방번호
let realNumber;

//접속한 사람들
let roomList=[];

exports.connection = (io, socket) => {
  console.log("진짜 socket!!!!!!!!!!!!!!!!!!", socket.request.session);
  socket.request.session.username = 'john_doe';
  socket.request.session.save();

  console.log("이름?", socket.request.session.username);
  
  //로그인하면 유저이름 받아서 DB에 저장하는거
  socket.on("userlist", (userid) => {
    myID = userid
    console.log("마이아이디",myID);
    console.log("유저이름",userid);
    const connectUser = connectList.create({
      userid: userid,
    });
  });

  // 접속하면 항상 내 이름으로 된 방으로 입장하는 코드
  socket?.join(myID)
  console.log("내이름!~!!!!!!!!!!!!!!!!!",myID)

  //누군가 접속했을 때마다 현재 누구 접속해있는지 갱신하는거
  io.emit("nowOn");

  socket.on("create", async (roomName, userid, mylist) => {
    // findall 해서 내가 입장하려는 방이랑 내 닉네임으로 만들어진 곳이 있는지 찾기
    const userFind1 = await room.findAll({
      where: {
        [Op.and]: [{ Name1: roomName }, { Name2: userid }],
      },
    });
    const userFind2 = await room.findAll({
      where: {
        [Op.and]: [{ Name1: userid }, { Name2: roomName }],
      },
    });
    //roomNumber꺼내기
    if (userFind1.length > 0) {
      userFind1.forEach((res) => {
        realNumber = res.roomNum;
      });
    }
    if (userFind2.length > 0) {
      userFind2.forEach((res) => {
        realNumber = res.roomNum;
      });
    }
    //방이 없으면 방 만들어줌
    if (userFind1.length === 0 && userFind2.length === 0) {
      console.log("방 만들어주는곳~~================");
      const createRoom = await room.create({
        Name1: userid,
        Name2: roomName,
      });

      //멤버 리스트에 나(userid), 상대(roomName) 추가하기
      const participant1 = await participant.create({
        roomNum: createRoom.roomNum,
        member_list: userid,
      });
      const participant2 = await participant.create({
        roomNum: createRoom.roomNum,
        member_list: roomName,
      });
      realNumber = createRoom.roomNum;
      socket.join(realNumber);
    } else {
      //만약에 방이 있으면(채팅내용 불러오기)
      console.log("============방있으면 오는곳=================");

      //내가 들어간 방 리스트에 들어가려는 방이 있으면 join은 안함
      if (roomList.join("").includes(realNumber)) {
        console.log("이미있음");
      } else {
        //리스트에 없으면 방에 join 시켜줌
        console.log("들어가는 방 번호", realNumber);
        socket.join(realNumber);
        roomList.push(realNumber);
      }

      //방 번호 프론트로 보내기
      socket.emit("roomNumber", realNumber);
      //채팅내용은 방 번호로 (findAll해서) 전부 가져오기
    }

    //socket.room에 방 이름 저장시켜둠
    socket.room = realNumber;
  });
  /////////create 끝/////////////

  //전체채팅방 입장
  socket.on("groupChat", async (userid) => {
    const res = await participant.findOne({
      where: { roomNum: 999, member_list: userid },
    });
    // participant 테이블에 없으면 추가
    if (res === null) {
      console.log("없음");
      participant.create({
        roomNum: 999,
        member_list: userid,
      });
    } else {
      //있을 때는 배열에 추가 안함
      console.log("있음");
    }
    socket.join(999); //999번방이 전체채팅방
    socket.emit("999Room", 999);
    roomList.push(999);

    //방번호 저장(메시지 보낼 때 필요)
    socket.room = 999;
    realNumber = 999;
    //방 번호 프론트로 보내기
  });

  //메세지 보내기
  socket.on("sendMessage", async (message, userid, otherName) => {
    io.to(socket.room).emit("newMessage", message);
    console.log("보내는 사람은?", otherName);
    //메세지 받은사람한테 알람가게하기
    io.to(otherName).emit("notification", myID);
    //받은 메세지랑, 보낸사람 DB에 다 저장하기
    const chatval = await Chat.create({
      roomNum: realNumber,
      message: message,
      send: userid,
    });
  });
};
