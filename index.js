const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

const {User} = require('./models/user')

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());



mongoose.connect(config.mongoURI,
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : true 
}).then(()=> console.log("MongoDB Connected Successfully!!!"))
.catch(err => console.log(err));






app.get('/', (req, res) => res.send('Ok!'));


app.post('/register', (req, res) => {
//회원 가입시 필요한 정보들을 clien에서 가져오면
//db에 저장
 const user = new User(req.body);
 user.save((err, doc) => {
     if(err) return res.json({success: false, err});
     return res.status(200).json({success: true});
 });
});



app.listen(port, () => console.log(`app listening on port ${port}!`));