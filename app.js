const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const react=require('./routes/reactapis');
const path = require('path');
const multer = require('multer');
//importing session package
const session = require('express-session');
//importing mysql-session package
const exp_mysql_sess = require('express-mysql-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
//graph ql package imported over here
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

var options = {
    host: 'localhost',
    user: 'root',
    database: 'headth2',
    password: '',
    port: 3306
}
var sessionStore = new exp_mysql_sess(options);
//trying winston console logger 
//this is just a simple implementation which will console log logs
const winston = require('winston');
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions);
//decalrations of logger till here

const csrfProtection = csrf();

const { uuidv4 } = require('uuid');
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("here is the error");
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        console.log("here is the issue");
        cb(null, file.originalname);
    }
});

const fileFilter2 = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'||
        file.mimetype === 'image/pdf' ||
        file.mimetype === 'image/docx'||
        file.mimetype === 'image/doc') {
        console.log("getting our fromhere");
        cb(null, true);
    }
    else {
        console.log("getting out fromhere 2");
        cb(null, false);
    }
}

function logReq(req, res, next) {
    logger.info(req.url);
    next();
}
app.use(logReq);
function logErr(req, res, next) {
    logger.error(req.url);
    next();
}
app.use(logErr);

//to overcome the  PayloadTooLargeError: request entity too large
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json());
//initiating the session middleware in line 65
app.use(session({ secret: 'HareKrishna', resave: false, saveUninitialized: false, store: sessionStore }));
//uncomment this line if u want to use csrf protection
// app.use(csrfProtection);
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

//console.log(limit);
//registering multer to store images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter2 }).single('image'));

//app.use('/images',express.static(path.join(__dirname,'images')))
//this line below is to check if connection with mysql server is working or not
db.execute('select * from userbasic').then(result => {
    console.log('connected and is success');
}).catch(err => {
    console.log('error');
});

app.use(express.static(__dirname + '/images'));

//defining a function to set headers so that it could be accessible from other ip addressses as well
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//to add csrf everywhere
// app.use((req,res,next)=>{
//     res.locals.csrfToken=req.csrfToken();
//     next();
// });
console.log(Date.now());
app.use('/app1', auth);
app.use('/admin', admin);
app.use('/react',react);
//graphql code setup over here
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    // to make a tester on localhost
    graphiql: true,
    formatError(err){
        if(!err.originalError)
        {
            return err;
        }
        else{
            const data=err.originalError.data;
            const message=err.message||"An error occurred";
            return {message:message,data:data};
        }
    }
}))
//this is the special error handler mechanism in nodejs
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(201).json({ status: 0, msg: message });
})

//Respond with hello world
app.get('/', function (req,res) {
	res.send('hello world');
});

//CT20182428795
app.listen(5000);
//code to remove a file from a folder
// const fs=require('fs');
// const path2='./images/back.jpg';
// fs.unlink(path2,(err)=>{
//     if(err)
//     {
//         console.log(err);
//         return;
//     }
//     else{
//         console.log('File removed successfully');
//     }
// });