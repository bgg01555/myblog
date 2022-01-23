const express = require('express')//express패키지 불러오기
const connect = require("./schemas");//index는 파일이름을 생략할 수 있다.
connect();//mongoose 와 mongodb 연결

const app = express()//서버 객체 받아오기d
const port = 3000;

const articlesRouter = require("./routes/articles");

const requestMiddleware = (req, res, next) => {
    console.log('Request URL: ', req.originalUrl, " - ", new Date());
    next();
}

app.use(express.static("static"));//static에 있는 html을 쓰겠다.
//맨처음에 index.html을 자동으로 찾음 . index.html은 goods.html로 가도록 설정되어있어서
//goods.html이 뜨는것임
app.use(express.json());//body로 들어오는 json data를 사용할 수 있게 파싱해주는 '미들웨어'
app.use(express.urlencoded());
app.use(/*"/api", 이런식으로 써서 앞에 api로 들어온 경우만 동작하도록 할 수 있음*/requestMiddleware);



app.use("/api", [articlesRouter]/* [goodRouter,userRouter] 이런식으로 쓸수도*/);

//라우터
app.get('/', function (req, res) {
    res.send('Hello World2')//응답
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌습니다.');
})