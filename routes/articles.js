const express = require('express');
const Article = require("../schemas/article");//..은 한단계 상위
const router = express.Router();//express가 제공하는 router 사용하기 위해


router.get("/", (req, res) => {
    res.send("this is root page");
});//미들웨어에서 정의한 주소(/api)는 기본주소로 해서 앞에 적을필요 없음

//게시글 목록 조회
router.get("/articles", async (req, res) => {
    const articles = await Article.find({});
    articles.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    res.json({
        articles,
    });
});

//게시글 작성
router.post("/articles", async (req, res) => {

    let date = new Date();
    const { username, password, title, contents } = req.body;
    await Article.create({ username, password, title, contents, date });
    res.json({ success: true });
})


//게시글 상세 조회
router.get("/articles/:articleId", async (req, res) => {
    const { articleId } = req.params;//입력받은 goodsId 가져오는법
    const [article] = await Article.find({ _id: articleId });
    res.json({
        article//detail:filteredItems[0],
    });
})

//게시글 수정
router.put("/articles", async (req, res) => {
    //const { goodsId } = req.params;
    const { articleId, title, contents, password } = req.body;


    const [existsArticles] = await Article.find({ articleId: articleId });
    let existPassword = existsArticles.password;
    if (existPassword == password) {
        let date = new Date();
        await Article.updateOne({ articleId: articleId }, { $set: { title, contents, date } });//body에서 받은quantity값으로 변경
    }
    else {
        res.status(400).json({ success: false, errorMessage: '비밀번호 틀림' });
    }



    res.json({ success: true });
})

//게시글 삭제
router.delete("/articles", async (req, res) => {

    //_id obejct에서 꺼내서 써야 할듯하다.
    const { articleId } = req.body;

    // const articleId = await Article.find({ goodsId: Number(articleId) });
    // if (existsCarts.length) {
    //     await Article.deleteOne({ _id: articleId });
    // }

    res.json({ success: true });
})



// router.get("/goods/cart", async (req, res) => {
//     const carts = await Cart.find();
//     const goodsIds = carts.map((cart) => cart.goodsId);//cart에 있는 goodsid들

//     const goods = await Goods.find({ goodsId: goodsIds });
//     //find에 배열을 넣으면 배열의 값들을 가진 id를 전부 찾아줌 

//     res.json({
//         cart: carts.map((cart) => {
//             return {
//                 quantity: cart.quantity,
//                 goods: goods.find((item) => item.goodsId === cart.goodsId),
//             };
//         }),
//     });
// });


// //상품조회 api
// //:뒤에는 goodsId 라는 이름으로 데이터를 받겠다 이거임
// router.get("/goods/:goodsId", async (req, res) => {//상품목록 api

//     const { goodsId } = req.params;//입력받은 goodsId 가져오는법
//     const [goods] = await Goods.find({ goodsId: Number(goodsId) });
//     //async await 으로 find로부터 받은 promise 풀어서 goods에 넣는데, find가 여러개니까 
//     // destructuring으로 첫번째것만 받았다. 


//     //const filteredItems = goods.filter((item) => item.goodsId === Number(goodsId));
//     //const [detail/*,detail2,detail3,..*/] = goods.filter((item) => item.goodsId === Number(goodsId));
//     res.json({
//         goods//detail:filteredItems[0],
//     });
//     // console.log(goodsId);
//     // res.send("goodsId 확인용");

//     // const details=[]
//     // const [detail] =details;
//     // 이런식으로 첫번째 아이템 받을 수 있다! 처음보는 문법인듯.. spreadoperator이랑 비슷한가

// });

// // //장바구니 상품 추가 api
// // router.post("/goods/:goodsId/cart", async (req, res) => {
// //     const { goodsId } = req.params;
// //     const { quantity } = req.body;

// //     const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
// //     if (existsCarts.length) {
// //         return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 있음" });
// //     }

// //     await Cart.create({ goodsId: Number(goodsId), quantity });

// //     res.json({ success: true });
// // });


// //장바구니 상품 삭제 api
// router.delete("/goods/:goodsId/cart", async (req, res) => {
//     const { goodsId } = req.params;

//     const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
//     if (existsCarts.length) {
//         await Cart.deleteOne({ goodsId: Number(goodsId) });
//     }

//     res.json({ success: true });
// })

// //장바구니 상품 수량 수정 api
// router.put("/goods/:goodsId/cart", async (req, res) => {
//     const { goodsId } = req.params;
//     const { quantity } = req.body;

//     const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
//     if (!existsCarts.length) {
//         //return res.status(400).json({ success: false, errorMessage: "장바구니에 해당 상품이 없는데요?" });

//         await Cart.create({ goodsId: Number(goodsId), quantity });
//         //장바구니 상품 없으면 생성함
//     } else {
//         await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });//body에서 받은quantity값으로 변경
//     }//장바구니 상품 있으면 업데이트


//     res.json({ success: true });

// })

// //상품추가 api
// router.post("/goods", async (req, res) => {

//     //const goodsId = req.body.goodsId;
//     //const name=req.body.name;
//     //...

//     //
//     const { goodsId, name, thumbnailUrl, category, price } = req.body;//이렇게 간략히 표현 가능(비구조화)
//     const goods = await Goods.find({ goodsId });
//     //find는 Promise를 반환함 => async await으로 비동기 처리
//     if (goods.length) {
//         return res
//             .status(400)
//             .json({ success: false, errorMessage: "이미 있는 데이터 입니다." });
//     }

//     const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

//     console.log(createdGoods);

//     res.json({ goods: createdGoods });

// });//put delete 등 get을 제외한 method는 body(payload)라는 데이터를 받아올 수 있다.

module.exports = router; //모듈화