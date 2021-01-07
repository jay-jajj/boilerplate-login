const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    lastName : {
        type: String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    //유효성 검사용
    token : {
        type : String
    },
    // 토큰 유효기간
    tokenExp : {
        type : Number
    }


})

const User = mongoose.model('User', userSchema);

module.exports = {User}