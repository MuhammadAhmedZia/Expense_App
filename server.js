const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const userRoute = require('./routes/userRoutes');
const dashboardRoute = require('./routes/dashboardRoute')
require('./config/database')

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));


app.use('/',userRoute);
app.use('/',dashboardRoute);

app.listen(PORT,()=>{
    console.log('server started on port:5000');
});
