const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
    console.log('들어와지나222')

    const { authorization } = req.headers;
    console.log(authorization);
    //헤더의 authorization 키 값 가져오기
    // 주의할게 프론트에서 대문자로 보내도 여기서는 소문자로 변환됨
    if (authorization == undefined) {
        res.status(400).json({ errorMessage: '로그인 후 사용하시오' })
        return;

    }

    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType != 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하시오',
        });
        return;
    }

    try {
        //const decoded = jwt.verify(tokenValue, "secret-juhyeon");
        const { username } = jwt.verify(tokenValue, "secret-juhyeon");
        User.findOne({ username }).exec().then((user) => {
            res.locals.user = user;
            console.log('토큰 잘됨');

            next();

        });


    } catch (error) {//jwt 토큰이 유효하지 않은 경우
        console.log('토큰 잘못됨')
        return res.status(401).send({
            user: null,
            errorMessage: '로그인 후 사용하시오',
        });
    }
}