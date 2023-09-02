const {User} = require('../models');
const {userRoom} = require('../models');

////////render화면///////////
//메인화면
exports.main = (req,res)=>{
    res.render('index');
}

//로그인
exports.signin = (req,res)=>{
    res.render('signin')
}

//회원가입
exports.signup = (req,res)=>{
    res.render('signup')
}
exports.chat = (req,res)=>{
    res.render('chat');
}
//1:1채팅
exports.private = (req,res)=>{
    res.render('private');
}

/////////전송////////////////
// 로그인
exports.post_signin = async (req,res)=>{
    const {userid, pw} = req.body
    const result = await User.findOne({
        where : {userid, pw}
    })
    res.send({result : true, result})
}

//회원가입
exports.post_signup = async (req,res)=>{
    const {userid, pw, name} = req.body
    const arr = [req.body.userid];
    const arr2 = JSON.stringify(arr); //유저 방 목록 배열 -> 문자열로 바꿔서 저장
    await User.create({userid, pw, name})
    res.send({result:true});
    await userRoom.create({userid : userid, roomList : arr2})
}