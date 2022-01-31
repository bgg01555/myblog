const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema({
    articleId: {
        type: String,
        required: true,
    },
    username: {
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

module.exports = mongoose.model("Comments", CommentSchema);
