const express = require('express')//express패키지 불러오기
const connect = require("./schemas/index");//index는 파일이름을 생략할 수 있다.
const authMiddleware = require("./middlewares/auth-middleware");
const router = express.Router();

const app = express()//서버 객체 받아오기d
const port = 3000;
connect();//mongoose 와 mongodb 연결

const articlesRouter = require("./routes/articles");
const userRouter = require("./routes/users");

app.use(express.static("static"));//static에 있는 css, static을 쓰겠다
app.use(express.json());
app.use(express.urlencoded());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get("/login", (req, res) => {
    res.render('login');
})
app.use("/users", [userRouter]);
app.use("/api", [articlesRouter]/* [goodRouter,userRouter] 이런식으로 쓸수도*/);


// app.get("/", authMiddleware, function (req, res) {
//     const { user } = res.locals;
//     console.log(user);
//     if (user) {
//         res.render("index");
//     }
//     else {
//         res.render("login"); // render 파일명(ejs 확장자는 생략이 가능) });
//     }
// });


// //라우터
// app.get('/', function (req, res) {
//     res.send('Hello World2')//응답
// });

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌습니다.');
})