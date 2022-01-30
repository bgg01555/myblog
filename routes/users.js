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

    // if (password != confirmPassword) {
    //     res.status(400).send({
    //         errorMessage: '패스워드가 패스워드 확인과 동일하지 않습니다.',
    //     });
    //     return;
    // }

    // const existUsers = await User.find({
    //     $or: [{ userId }, { nickname }],
    // });//or 조건으로 userId이 겹치거나 아니면 nickname이 겹치는 데이터가 있는지 있다면 가져옴

    // if (existUsers.length) {
    //     res.status(400).send({
    //         errorMessage: '이미 존재하는 ID 또는 닉네임이 있습니다.',
    //     });
    //     return;
    // }

    const user = new User({ username, password });
    user.save();

    res.status(201).send({});

});

//중복체크 api
router.post("/dup", async (req, res) => {
    const { username } = req.body;
    console.log('111111111111');
    const existUser = await User.findOne({ username });
    console.log('11112221');
    console.log(existUser);
    if (existUser) {
        res.json({ exist: true });
        return;
    }

    res.json({ success: true, msg: '사용 가능한 id 입니다.' });

})

//로그인 api
router.post("/auth", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await User.findOne({ username, password }).exec();
    console.log(user);
    if (!user) {
        res.status(400).send({
            errorMessage: '이메일 또는 패스워드가 잘못되었습니다.'
        });
        return;
    }

    console.log("@@@12@123123");
    const token = jwt.sign({ username: user.username }, "secret-juhyeon");
    res.send({
        token,
    });//send로 보내주네? json으로 대체가능한가?
});


//자기 정보 api
router.get('/me', authMiddleware, async (req, res) => {
    const { user } = res.locals; //res.locals.user

    if (user) {
        return res.send({
            'user': {
                'username': user.username,
            },
        })
    }
    else {
        res.status(400).send({
            // user,//사실 지금은 이렇게 다 보내도 상관없음
            user: {
                username: user.username,
            },
        });
    }

})


module.exports = router;