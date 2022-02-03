//스키마 생성
const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/my_blog", { ignoreUndefined: true }).catch(err => console.error());
};//mongoose를 mongoDB와 연결해주어야한다
module.exports = connect;


// //스키마 생성
// const mongoose = require("mongoose");

// const connect = () => {
//     mongoose.connect("mongodb://bgg01578:wngus4582@localhost:27017/my_blog?authSource=admin", { ignoreUndefined: true }).catch(err => console.log(err));
// };//mongoose를 mongoDB와 연결해주어야한다
// module.exports = connect;




