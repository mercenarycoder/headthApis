//models are imported from here
const company = require('../models/company');
const prescription=require('../models/prescription');
const medicine=require('../models/medicine');
const dieseas=require('../models/dieseas');
const allergy=require('../models/allergy');
const history=require('../models/history');
const reports=require('../models/report');
const user=require('../models/user');
const accessrecord=require('../models/accessrecord');
//till here
//bcrypt package to encrypt password
const bcrypt = require('bcryptjs');
//importing third party mailer support
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const validator = require('validator');
// const history = require('../models/history');
const { validationResult } = require('express-validator')
// importing jsonwebtoken 
const jwt = require('jsonwebtoken');
const jwt_Secret = "Harekrishnaharekrishnailovemybestfriendandmyeternalteacher";
// will be used while sending mails
var transport2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'manjeet.singh.9723@gmail.com',
        pass: 'eyecon@1'
    }
});

// way to generate and check the jwt web token
const createToken = async () => {
    const secret = "ilovelordkrishnaandheismyteacherandbestfriend";
    const token = jwt.sign({ email: "manjeetts869@gmail.com" }, secret);
    console.log(token);
    const userVer = jwt.verify(token, secret);
    console.log(userVer);
    history.getHistoryByMobile('789438159').then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

// createToken();

exports.register = async (req, res, next) => {
    try{
    const email = req.body.email;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;

    const account = req.body.account;
    if(!req.file)
    {
        const err=new Error('Proof document is required');
        err.statusCode=200;
        throw err;
    }
    const doc=req.file.path;
    console.log(doc);
    if (!email || !validator.isEmail(email)) {
        const err = new Error('Invalid email');
        err.statusCode = 200;
        throw (err);
    }
    if (!password || password.length<8 || !fname || !lname || !account) {
        const err = new Error('Invalid request made');
        err.statusCode = 200;
        throw (err);
    }
    console.log(email, " ", fname, " ", lname, " ", password, " ");
    const pass = await bcrypt.hash(password, 12);
    console.log(pass);
    const token = await jwt.sign({ email: email }, jwt_Secret);

    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num == 0) {

            const newR = new company(fname, lname, email, pass, account, token,doc);
            newR.save().then(result => {
                res.status(201).json({ status: 1, msg: 'registration successfully', token: token });
                var mailOptions = {
                    from: 'manjeet.singh.9723@gmail.com',
                    to: email,
                    subject: 'Account created',
                    text: `<h1>Your account was successfully created now take a pill and chill</h1>`
                };
                transport2.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Email sent : ' + info.response);
                    }
                });
            }).catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 200;
                }
                next(err);
            });


        }
        else {
            res.status(200).json({ status: 0, msg: 'email already registered' });
        }
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
catch(err)
{
    next(err);
}
}

exports.login = async (req, res, next) => {
    try{
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        const err = new Error('Invalid email over here');
        err.statusCode = 200;
        throw (err);
    }
    if (!password || password.length < 8) {
        const err = new Error('Invalid request made');
        err.statusCode = 200;
        throw (err);
    }
    const token = await jwt.sign({ email: email }, jwt_Secret);

    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num > 0) {
            return company.login(email).then(result => {
                let obj = result[0];
                obj = obj[0];
                bcrypt.compare(password, obj.password).then(match => {
                    if (match) {
                        company.updateToken(token, email).then(result => {
                            res.status(201).json({ status: 1, msg: 'logged successfully', token: token });
                        }).catch(err => {
                            console.log(err);
                            if (!err.statusCode) {
                                err.statusCode = 200;
                            }
                            next(err);
                        });
                    }
                    else {
                        res.status(201).json({ status: 0, msg: 'Wrong Password provided' });
                    }
                })
            }).catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 200;
                }
                next(err);
            })
        }
        else {
            res.status(200).json({ status: 0, msg: 'Email is not registered with us' });
        }
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
catch(err)
{
    next(err);
}
}

exports.searchFuntion=async(req,res,next)=>{
    try{
        const token=req.body.token;
        const mobile=req.body.number;
        let reportsF=null;
        let profileF=null;
        let precriptionsF=null;
        let dieseasF=null;
        let allergyF=null;
        let historyF=null;
        let medicineF=null;
        if(!mobile||mobile.length<10)
        {
            const err=new Error('Invalid mobile number');
            err.statusCode=200;
            throw err;
        }
        if(!token||token.length<15)
        {
            const err=new Error('Token is not supplied');
            err.statusCode=200;
            throw err;
        }
        const emailD=await jwt.verify(token,jwt_Secret);
        console.log('hi ia ma here ',emailD.email);
        company.check(emailD.email).then(result=>{
            console.log(result[0]);
            let num=result[0];
            num=num[0];
            // console.log(num);
            if(num.num>0)
            {
                const entry=new accessrecord(emailD.email,mobile,"basic");
                return entry.save();
            }
            else
            {
                console.log('reaching here');
                res.status(200).json({status:0,msg:'Email is not registered with us..'});
            }
        }).then(res=>{
            return user.getProfile(mobile);
        }).then(result=>{
            profileF=result[0];
            // res.status(201).json({status:1,profile:result[0],mobile:mobile,msg:'profile fetched successfully'});
            return prescription.getAllById(mobile);
        }).then(result=>{
            precriptionsF=result[0];
            return reports.getReport(mobile);
        }).then(result=>{
            reportsF=result[0];
            return dieseas.getDieseasByMobile(mobile);
        }).then(result=>{
            dieseasF=result[0];
            return medicine.getMedicines(mobile);
        }).then(result=>{
            medicineF=result[0];
            return allergy.getAllergyByMobile(mobile);
        }).then(result=>{
            allergyF=result[0];
            return history.getHistoryByMobile(mobile);
        }).then(result=>{
            historyF=result[0];
            res.status(201).json({status:1,profile:profileF,prescription:precriptionsF,report:reportsF,medicine:medicineF,history:historyF,allergy:allergyF,diesease:dieseasF,msg:'basic profile fetched successfully'});
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
        // res.status(201).json({status:1,email:emailD});
    }
    catch(err)
    {
        next(err);
    }
}

exports.reportsFunction=async(req,res,next)=>{
    try{
        const token=req.body.token;
        const mobile=req.body.number;
        let reportsF=null;
        if(!mobile||mobile.length<10)
        {
            const err=new Error('Invalid mobile number');
            err.statusCode=200;
            throw err;
        }
        if(!token||token.length<15)
        {
            const err=new Error('Token is not supplied');
            err.statusCode=200;
            throw err;
        }
        const emailD=await jwt.verify(token,jwt_Secret);
        console.log('hi ia ma here ',emailD.email);
        company.check(emailD.email).then(result=>{
            console.log(result[0]);
            let num=result[0];
            num=num[0];
            // console.log(num);
            if(num.num>0)
            {
                const entry=new accessrecord(emailD.email,mobile,"report");
                return entry.save();
            }
            else
            {
                console.log('reaching here');
                res.status(200).json({status:0,msg:'Email is not registered with us..'});
            }
        }).then(result=>{
            // precriptionsF=result[0];
            return reports.getReport(mobile);
        }).then(result=>{
            reportsF=result[0];
            res.status(201).json({status:1,report:reportsF,msg:'reports fetched'});
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
        // res.status(201).json({status:1,email:emailD});
    }
    catch(err)
    {
        next(err);
    }
}

exports.prescriptionFunction=async(req,res,next)=>{
    try{
        const token=req.body.token;
        const mobile=req.body.number;
        let reportsF=null;
        if(!mobile||mobile.length<10)
        {
            const err=new Error('Invalid mobile number');
            err.statusCode=200;
            throw err;
        }
        if(!token||token.length<15)
        {
            const err=new Error('Token is not supplied');
            err.statusCode=200;
            throw err;
        }
        const emailD=await jwt.verify(token,jwt_Secret);
        console.log('hi ia ma here ',emailD.email);
        company.check(emailD.email).then(result=>{
            console.log(result[0]);
            let num=result[0];
            num=num[0];
            // console.log(num);
            if(num.num>0)
            {
                const entry=new accessrecord(emailD.email,mobile,"prescription");
                return entry.save();
            }
            else
            {
                console.log('reaching here');
                res.status(200).json({status:0,msg:'Email is not registered with us..'});
            }
        }).then(result=>{
            // precriptionsF=result[0];
            return prescription.getAllById(mobile);
        }).then(result=>{
            reportsF=result[0];
            res.status(201).json({status:1,prescription:reportsF,msg:'prescriptions fetched'});
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
        // res.status(201).json({status:1,email:emailD});
    }
    catch(err)
    {
        next(err);
    }
}