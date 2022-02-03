const express = require('express');
const Article = require("../schemas/article");//..은 한단계 상위
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();//express가 제공하는 router 사용하기 위해
const Comment = require("../schemas/comment");
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/articles_main", (req, res) => {
    res.render('article_main');
})

//게시글 목록 조회
router.get("/articles", async (req, res) => {
    const articles = await Article.find({});

    articles.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    for (let i = 0; i < articles.length; i++) {
        const articles_cnt = await Comment.count({ articleId: articles[i]._id })
        articles[i].articles_cnt = articles_cnt;
        //articles[i].articles_cnt = articles_cnt;
    }

    res.render('article_main', { articles: articles });
});

//게시글 작성 페이지로
router.get("/articles_to", (req, res) => {
    res.render('article_detail', { article: { _id: '', title: '', contents: '', username: '' }, comments: false });
})

//게시글 상세 조회====================
router.get("/articles/:articleId", async (req, res) => {
    const { articleId } = req.params;
    const [article] = await Article.find({ _id: articleId });
    let { username } = req.query;

    //댓글조회
    const comments = await Comment.find({ articleId: articleId });
    comments.sort(function (a, b) {

        return new Date(b.date) - new Date(a.date);
    });




    res.render('article_detail', { article: article, comments: comments, username });
})

//게시글 작성 + 수정
router.put("/articles", authMiddleware, async (req, res) => {
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    const { articleId, title, contents } = req.body;
    let username = res.locals.user.username;

    //게시글 수정
    if (articleId != '') {
        const existArticle = await Article.findOne({ _id: articleId });
        if (existArticle.username != username) {
            return res.status(400).json({ success: false, msg: '수정 권한이 없습니다.' });
        }

        if (title != '' && contents != '') {
            await Article.updateOne({ _id: articleId }, { $set: { title, contents, date } });
            return res.json({ success: true, msg: '수정 완료' });
        }

        else {
            return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' })
        }
    }


    //게시글 작성
    else if (title != '' && contents != '') {
        await Article.create({ username, title, contents, date });
        return res.json({ success: true, msg: '작성 완료' });
    }
    else {
        return res.status(400).json({ success: false, msg: '빈칸 없이 입력하세요' });
    }
})

//게시글 삭제
router.delete("/articles", authMiddleware, async (req, res) => {


    const { articleId } = req.body;
    const [existsArticle] = await Article.find({ _id: articleId });
    const username = res.locals.user.username;

    if (existsArticle.username === username) {
        await Article.deleteOne({ _id: articleId });
        return res.json({ success: true, msg: '삭제 완료' });
    }

    return res.status(400).json({ success: false, msg: '삭제 권한이 없습니다.' });
})

router.post("/comments", authMiddleware, async (req, res) => {

    const username = res.locals.user.username;
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    const { contents, articleId } = req.body;
    if (contents == '') {
        return res.status(400).json({
            msg: '내용을 입력해 주세요.'
        })

    }
    const comment = new Comment({ articleId, username, contents, date });
    comment.save();
    res.json({
        msg: '댓글 작성 완료',
    })

})

router.put("/comments", authMiddleware, async (req, res) => {
    const { commentId, contents } = req.body;
    const { username } = res.locals.user;

    let existsComment = await Comment.findOne({ _id: commentId });
    if (existsComment.username === username) {
        await Comment.updateOne({ _id: commentId }, { $set: { contents } });
        res.json({ msg: '댓글 수정 완료' });
    }
    else {
        res.status(400).json({ msg: '수정권한 없음' });
    }
})

router.delete("/comments", authMiddleware, async (req, res) => {
    const { commentId } = req.body;
    const { username } = res.locals.user;
    const existsComment = await Comment.findOne({ _id: commentId });

    if (existsComment.username === username) {
        await Comment.deleteOne({ _id: commentId });
        res.json({ msg: '댓글 삭제 완료' });
    }
    else {
        res.status(400).json({ msg: '댓글 삭제 권한 없음' });
    }
})


module.exports = router; //모듈화