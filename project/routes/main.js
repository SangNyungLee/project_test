const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

//메인화면
router.get("/", controller.main);

//회원가입
router.get("/signup", controller.signup);
router.post("/signup", controller.post_signup);

//로그인
router.get("/signin", controller.signin);
router.post("/signin", controller.post_signin);

//로그인 후 화면
router.get("/chat", controller.chat);

//1:1화면
router.get("/private", controller.private);

//채팅
router.post("/chat", controller.post_chat);

//채팅 불러오기
router.post("/preMessage", controller.preMessage);

//현재 접속자 불러오기
router.post("/ConnectUser", controller.ConnectUser);
module.exports = router;
