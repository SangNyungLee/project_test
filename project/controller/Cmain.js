const {
  User,
  room,
  Sequelize,
  Chat,
  participant,
  connectList,
} = require("../models");
const Op = Sequelize.Op;

////////render화면///////////
//메인화면
exports.main = (req, res) => {
  res.render("index");
};

//로그인
exports.signin = (req, res) => {
  res.render("signin");
};

//회원가입
exports.signup = (req, res) => {
  res.render("signup");
};
exports.chat = (req, res) => {
  res.render("chat");
};
//1:1채팅
exports.private = (req, res) => {
  res.render("private");
};

/////////전송////////////////
// 로그인
exports.post_signin = async (req, res) => {
  const { userid, pw } = req.body;
  const result = await User.findOne({
    where: { userid, pw },
  });
  res.send({ result: true, result });
};

//회원가입
exports.post_signup = async (req, res) => {
  const { userid, pw, name } = req.body;
  const arr = [req.body.userid];
  await User.create({ userid, pw, name });
  await participant.create({ roomNum: 999, member_list: userid });
  res.send({ result: true });
};

//채팅
exports.post_chat = async (req, res) => {
  let list = [];
  try {
    myName = req.body.userid;
    const listfind = await room.findAll({
      where: {
        [Op.or]: [{ Name1: myName }, { Name2: myName }],
      },
    });
    // console.log(listfind)
    //빈배열이 아닐 때 발동함
    if (listfind != []) {
      listfind.forEach((res) => {
        if (res.Name1 != myName) {
          list.push(res.Name1);
        }
        if (res.Name2 != myName) {
          list.push(res.Name2);
        }
      });
    } else {
      console.log("빈배열임 ㅠ");
      console.log("리스트", list);
    }
    //배열로 담겨있음
    console.log("리스트===", list);
    res.send(list);
  } catch (error) {
    console.log(error);
  }
};
exports.preMessage = async (req, res) => {
  try {
    let chatMessage = await Chat.findAll({
      where: { roomNum: req.body.roomNum },
    });
    res.send({ chatMessage });
  } catch (error) {
    console.log("에러=====================", error);
  }
};

exports.ConnectUser = async (req, res) => {
  let ConnectUser = await connectList.findAll();
  res.send(ConnectUser);
};
