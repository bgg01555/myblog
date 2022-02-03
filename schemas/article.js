const mongoose = require("mongoose");
const Comment = require('../schemas/comment');

const ArticleSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

// ArticleSchema.pre('findOneAndRemove', { document: false, query: true },
//     async function () { // 지워지는 자신을 찾는다.
//         const doc = await this.model.findOne(this.getFilter()) // 링크가 되어 있는 키를 맵핑해서 삭제한다.
//         await commentSchema.deleteMany({ articleId: doc._id.toString() });
//     });

ArticleSchema.pre(
    "deleteOne", { document: false, query: true },
    async function (next) {
        // post id
        const { _id } = this.getFilter();

        // 관련 댓글 삭제
        await Comment.deleteMany({ articleId: _id });
        next();
    }
);


module.exports = mongoose.model("Articles", ArticleSchema);
