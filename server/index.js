//express 웹서버를 쉽게 만들기 위한 웹 프레임워크 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const app = express();
const port = 4000;

const {User} = require('./models/User')
const {auth} = require("./middleware/auth");
const config = require('./config/key');

app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());

app.use(cookieParser());

mongoose.connect(config.mongoURI,
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : true 
}).then(()=> console.log("MongoDB Connected Successfully!!!"))
.catch(err => console.log(err));






app.get('/', (req, res) => res.send('Ok!'));


app.post('/api/users/register', (req, res) => {
//회원 가입시 필요한 정보들을 clien에서 가져오면
//db에 저장
 const user = new User(req.body);
 user.save((err, doc) => {
     if(err) return res.json({success: false, err});
     return res.status(200).json({success: true});
 });
});


app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터 베이스에서 있는지 찾는다.
    User.findOne({ email : req.body.email }, (err, user) =>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다. "
            });
        }
        //요청한 이메일이 db에 있다면  비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch){
                return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
            }
            //비밀 번호가 맞다면 token을 생성 시켜줌
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에?
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, message: "logined Successfully"})
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) =>{
//여기까지 미들웨를 통과해 왔다는 얘기는 Authentication(인증)이 true라는 말

    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false: true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role: req.user.role,
        image : req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
   
    User.findOneAndUpdate({_id: req.user._id}, 
        {token : ""}, 
        (err, user) =>{
            if(err) return res.json({success : false, err});
            return res.status(200).send({success: true})
        })

})


app.get('/api/hello', (req,res) =>{
    res.send("안녕하세요");
})


app.listen(port, () => console.log(`app listening on port ${port}!`));