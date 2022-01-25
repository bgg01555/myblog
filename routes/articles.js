const express = require('express');
const Article = require("../schemas/article");//..은 한단계 상위
const router = express.Router();//express가 제공하는 router 사용하기 위해
let moment = require('moment');

router.get("/articles_main", (req, res) => {
    res.render('article_main');
})

router.get("/", (req, res) => {
    res.send("this is root page");
});//미들웨어에서 정의한 주소(/api)는 기본주소로 해서 앞에 적을필요 없음


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

// //게시글 작성
// router.post("/articles", async (req, res) => {
//     console.log('555');

//     let date = moment().format("YYYY-MM-DD dddd HH:mm:ss");

//     const { username, password, title, contents } = req.body;
//     await Article.create({ username, password, title, contents, date });
//     res.render('article_main');
// })

//게시글 작성 페이지로
router.get("/articles_to", (req, res) => {
    res.render('article_detail', { article: false });
})

//게시글 상세 조회====================
router.get("/articles/:articleId", async (req, res) => {

    const { articleId } = req.params;
    const [article] = await Article.find({ _id: articleId });


    res.render('article_detail', { article: article });
})

//게시글 작성 + 수정
router.put("/articles", async (req, res) => {
    let date = moment().format('YYYY-MM-DD HH:mm:ss');

    const { username, articleId, title, contents, password } = req.body;


    //게시글 수정
    if (articleId != '') {
        if (username != '' && title != '' && contents != '' && password != '') {
            const [existsArticles] = await Article.find({ _id: articleId });
            let existsPassword = existsArticles.password;
            if (existsPassword == password) {
                await Article.updateOne({ _id: articleId }, { $set: { title, contents, date } });//body에서 받은quantity값으로 변경
                return res.json({ success: true, msg: '수정 완료' });
                //res.render('article_detail', { article: existsArticles });
            }
            else {
                return res.status(400).json({ success: false, msg: '비밀번호 틀림' });
            }
        }
        else {
            return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' })
        }
    }


    //게시글 작성
    else if (username != '' && title != '' && password != '' && contents != '') {
        await Article.create({ username, password, title, contents, date });
        const articles = await Article.find({ articleId: articleId });
        return res.json({ success: true, msg: '작성 완료' });
        // res.render('article_main', { articles: articles });
    }
    else {
        return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' });
    }


})

//게시글 삭제
router.delete("/articles", async (req, res) => {


    const { articleId, password } = req.body;
    const [existsArticle] = await Article.find({ _id: articleId });

    if (existsArticle) {
        let existsPassword = existsArticle.password;

        if (password == existsPassword) {
            await Article.deleteOne({ _id: articleId });
            return res.json({ success: true, msg: '삭제 완료' });
        }
        else {
            return res.status(400).json({ success: false, msg: '비밀번호 틀림' });
        }
    }

    return res.status(400).json({ success: false, msg: '존재하지 않는 게시글 입니다.' });
})

module.exports = router; //모듈화