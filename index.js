const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jay:soclsrn1@sign.ru6qq.mongodb.net/<dbname>?retryWrites=true&w=majority',
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : true 
}).then(()=> console.log("MongoDB Connected Successfully!!!"))
.catch(err => console.log(err));

