const express = require('express');
const Article = require("../schemas/article");//..은 한단계 상위
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();//express가 제공하는 router 사용하기 위해
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


router.get("/", (req, res) => {
    res.send("this is root page");
});//미들웨어에서 정의한 주소(/api)는 기본주소로 해서 앞에 적을필요 없음


router.get("/articles_main", (req, res) => {
    res.render('article_main');
})

//게시글 목록 조회
router.get("/articles", async (req, res) => {
    const articles = await Article.find({});

    articles.sort(function (a, b) {
        console.log(new Date(a.date));
        console.log(new Date(b.date));

        return new Date(b.date) - new Date(a.date);
    });
    res.render('article_main', { articles: articles });
});

//게시글 작성 페이지로
router.get("/articles_to", (req, res) => {
    res.render('article_detail', { article: { _id: '', title: '', contents: '', username: '' } });
})

//게시글 상세 조회====================
router.get("/articles/:articleId", async (req, res) => {
    console.log('여기는 접속됨')
    const { articleId } = req.params;
    const [article] = await Article.find({ _id: articleId });


    res.render('article_detail', { article: article });
})

//게시글 작성 + 수정
router.put("/articles", authMiddleware, async (req, res) => {
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    const { articleId, title, contents } = req.body;
    let { user } = res.locals;
    let username = user.username;

    //게시글 수정
    if (articleId != '') {
        if (title != '' && contents != '') {
            await Article.updateOne({ _id: articleId }, { $set: { title, contents, date } });//body에서 받은quantity값으로 변경
            return res.json({ success: true, msg: '수정 완료' });
            //res.render('article_detail', { article: existsArticles });
            //return res.status(400).json({ success: false, msg: '비밀번호 틀림' });
        }
        else {
            return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' })
        }
    }


    //게시글 작성
    else if (title != '' && contents != '') {
        console.log('여기들어옴');
        console.log(username);
        await Article.create({ username, title, contents, date });

        //const articles = await Article.find({ articleId: articleId });
        return res.json({ success: true, msg: '작성 완료' });
        // res.render('article_main', { articles: articles });
    }
    else {
        console.log('여기들어오나?22');

        return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' });
    }


})

//게시글 삭제
router.delete("/articles", authMiddleware, async (req, res) => {


    const { articleId } = req.body;
    const [existsArticle] = await Article.find({ _id: articleId });
    const { user } = res.locals;

    if (existsArticle.username === user.username) {
        await Article.deleteOne({ _id: articleId });
        return res.json({ success: true, msg: '삭제 완료' });
        //    return res.status(400).json({ success: false, msg: '비밀번호 틀림' });
    }

    return res.status(400).json({ success: false, msg: '삭제 권한이 없습니다.' });
})

module.exports = router; //모듈화