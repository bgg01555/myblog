const express = require('express');
const Article = require("../schemas/article");//..은 한단계 상위
const User = require("../schemas/user");
const router = express.Router();//express가 제공하는 router 사용하기 위해
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require('jsonwebtoken');

//회원가입
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const user = new User({ username, password });
    user.save();

    res.status(201).send({});
});

//중복체크 api
router.post("/dup", async (req, res) => {
    const { username } = req.body;
    const existUser = await User.findOne({ username });
    if (existUser) {
        res.json({ exist: true });
        return;
    }
    res.json({ success: true, msg: '사용 가능한 id 입니다.' });
})

//로그인 api
router.post("/auth", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).exec();

    //id,pw 가 일치하지 않는 유저
    if (!user) {
        res.status(400).send({ errorMessage: '이메일 또는 패스워드가 잘못되었습니다.' });
        return;
    }

    //로그인 성공, 토큰 발급
    const token = jwt.sign({ username }, "secret-juhyeon");
    res.send({ token, });
});


//자기 정보 api
router.get('/me', authMiddleware, async (req, res) => {
    const { user } = res.locals; //res.locals.user

    if (user) {
        return res.send({
            user: { username: user.username },
        })
    }
    // else {
    //     res.status(400).send({
    //         user: null,
    //     });
    // }
})


module.exports = router;