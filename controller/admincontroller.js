//models import over here
const company = require('../models/company');
const company2 = require('../models/company2');
const resetpassword=require('../models/resetpassword');

const bcrypt = require('bcryptjs');
//importing third party mailer support
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const crypto=require('crypto');
const {validationResult}=require('express-validator')


var transport2=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'manjeet.singh.9723@gmail.com',
        pass:'eyecon@1'
    }
});


exports.baseLogin = (req, res, next) => {
    const log = req.session.islogged;
    if (log === true) {
        res.redirect('/admin/controller');
    }
    else {
        let msg=req.flash('error');
        if(msg.lenght>0)
        {
            msg=msg[0];
        }
        else
        {
            msg=null;
        }
        res.render('welcome', { msg: msg ,email:'',password:""});
    }
}

exports.check = (req, res, next) => {
    const email = req.body.username;
    const pass = req.body.password;
    const errors=validationResult(req);
    console.log(errors.array());
    //express-validator is not functioning in this module
    if(!errors.isEmpty())
    {
        console.log(errors.array());
        return res.status(422).render('welcome',{msg:errors.array()[0].msg,email:email,password:pass});
    }
    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num > 0) {
            return company.login(email).then(result => {
                console.log(result);
                let obj = result[0];
                obj = obj[0];
                //this method of bcrypt package compares the password given with the hashed password and then returns a boolean result which is true or false
                bcrypt.compare(pass, obj.password).then(match => {
                    if (match) {
                        req.session.email = obj.email;
                        req.session.islogged = true;
                        //this will ensure when the session is saved then only things will proceed
                        req.session.save(err => {
                            res.redirect('controller');
                        });
                    }
                    else {
                        res.render('welcome', { msg: 'Password is incorrect' ,email:email,password:''});
                    }
                }).catch(err => {
                    console.log(err);
                    res.redirect('/admin/welcome');
                });
            }).catch(err => {
                console.log(err);
                if (email === 'name') {
                    req.session.islogged = true;
                    res.redirect('controller');
                }
                else {
                    res.redirect('/admin/welcome');
                }
            });
        }
        else {
            res.render('welcome', { msg: 'Email does not exist' ,email:email,password:pass});
        }
    }).catch(err => {
        console.log(err);
        res.render('welcome', { msg: '' ,email:email,password:pass});
    })
}

exports.logout = (req, res, next) => {
    const log = req.session.islogged;
    if (log == true) {
        req.flash('error', 'Logout operation successfull');
        req.session.destroy((err) => {
            console.log(err);
            res.redirect('/admin/welcome');
        });
    }
    else {
        console.log("You need to login to use this feature....");
    }
}

exports.change=(req,res,next)=>{
    res.render('change',{msg:''});
}

exports.welcome = (req, res, next) => {
    //this is the way to get a cookie
    const log = req.session.islogged;
    if (log === true) {
        res.render('landing');
    }
    else {
        req.flash('error', 'Please Login first to use this route');
        res.redirect('/admin/welcome');
    }
}

exports.register = (req, res, next) => {
    // res.render('register',{valid:' '});
    const log = req.session.islogged;
    if (log === true) {
        res.redirect('/admin/controller');
    }
    else {
        res.render('register', { valid: '',name:'',last:'',email:'',password:'',cpassword:''});
    }
}

exports.doRegister = (req, res, next) => {
    const first = req.body.fname;
    const last = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
    console.log(errors.array()[0]);
    return res.status(422).render('register', { valid: errors.array()[0].msg,name:'',last:'',email:'',password:'',cpassword:'' });
    }
    if (!first || !last || !email || !password) {
        console.log("Request made was not having all the details required..");
    return res.status(422).render('register', { valid: "Invalid format",name:'',last:'',email:'',password:'',cpassword:'' });
    }
    company.check(email).then(result => {
        let obj = result[0];
        obj = obj[0];
        if (obj.num == 0) {
            return bcrypt.hash(password, 12).then(pass => {
                return pass;
            }).then(hashp => {
                console.log(first, " ", last, " ", email, " ", hashp);
                const com = new company(first, last, email, hashp);
                return com.save();
            }).then(result => {
                //this is the way to set cookie
                req.session.islogged = true;
                req.session.email = email;
                res.redirect('/admin/controller');
                var mailOptions={
                    from:'manjeet.singh.9723@gmail.com',
                    to:email,
                    subject:'Account created',
                    text:`<h1>Your account was successfully created now take a pill and chill</h1>`
                }; 
                transport2.sendMail(mailOptions,(err,info)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log('Email sent : '+info.response);
                    }
                });
            }).catch(err => {
                console.log(err);
                res.render('register', { valid: err,name:first,last:last,email:email,password:password,cpassword:password });
            });
        }
        else {
            res.render('register', { valid: 'The email already exists',name:first,last:last,email:email,password:password,cpassword:password});
        }
    }).catch(err => {
        console.log(err);
        res.redirect('/register');
    });
}

exports.resetPassword=(req,res,next)=>{
    const email=req.body.email;
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        console.log(error.array()[0].msg);
        return res.render('change',{msg:error.array()[0].msg});
    }
    if(!email)
    {
        console.log('Email is required');
        res.redirect('/admin/change');
    }
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err);
            return res.redirect('/admin/change');
        }
        const token=buffer.toString('hex');
        company.check(email).then(c=>{
            let count=c[0];
            count=count[0];
            if(count.num>0)
            {
                let tt=Date.now()+3600000;
                let rest=new resetpassword(email,token,tt);
                rest.save().then(result=>{
                    let mailOptions={
                        from:'manjeet.singh.9723@gmail.com',
                        to:email,
                        subject:'Password reset request',
                        html:`<h1>Your request to change your password approved</h1>
                        <p><a href="http://localhost:5000/admin/${token}">Click here to reset</a></p>`
                    };
                    transport2.sendMail(mailOptions,(err,info)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log('Email sent : '+info.response);
                    }
                });
                res.redirect('/admin/welcome');
                }).catch(err=>{
                    console.log(err);
                });
               // res.redirect('/admin/welcome');    
            }
            else
            {
                console.log("No email with this adderess found");
                res.render('change',{msg:'Email not found'});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
}
exports.confirmChange=(req,res,next)=>{
    const token=req.params.token;
    let email;
    console.log(token);
    if(!token)
    {
        console.log("invalid request");
        res.render('fail');
    }
    resetpassword.search(token).then(result=>{
    let obj=result[0];
    obj=obj[0];
    email=obj.email;
    console.log(email);
    let tt=Date.now()+3600000;
    console.log(obj.time);
    if(1==1)
    {
        return resetpassword.delete(email,token);
    }
    else{
        res.render('<h1>Token expired please generate the request again</h1>');
    }
    }).then(rr=>{
        res.render('confirmChange',{email:email,msg:''});
    }).catch(err=>{
        console.log(err);
        res.render('notoken');
    });
    //res.render('fail');
}
exports.finalChange=(req,res,next)=>{
    const email=req.body.email;
    const cpassword=req.body.cpassword;
    const password=req.body.password;
    console.log(email);
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.render('confirmChange',{email:email,msg:error.array()[0].msg});
    }
    if(!email||!password)
    {
        console.log("invalid request made");
        return res.render('fail');
    }
    bcrypt.hash(password,12).then(cryp=>{
        return company.alterPass(email,cryp);
    }).then(result=>{
        console.log("Password resetted to new password ",password);
        res.redirect('/admin/welcome');
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/admin/welcome');
    });
}

exports.summary=(req,res,next)=>{
    res.render('summary');
}

exports.setting=(req,res,next)=>{
    let email=req.session.email;
    company2.check(email).then(result=>{
        let count=result[0];
        count=count[0];
        if(count.c>0)
        {
            return company2.getInfo(email);
        }
        else
        {
            let newSum=new company2(email,"a basic summary","default");
            newSum.save().then(rr=>{
                return company2.getInfo(email);
            }).catch(err=>{
                console.log(err);
                res.redirect('/admin/controller');
            });
        }
    }).then(result=>{
        let obj=result[0];
        obj=obj[0];
        let email=obj.email;
        let summary=obj.summary;
        let img=obj.img;
        return res.render('setting',{email:email,summary:summary,img:img});
    }).catch(err=>{
        console.log(err);
        res.redirect('/admin/controller');
    });
}

exports.updateSetting=(req,res,next)=>{
    const email=req.session.email;
    const summary=req.body.summary;
    const icon=req.body.icon;
    const file=req.file;
    console.log(file);
    company2.getInfo(email).then(result=>{
        let obj=result[0];
        obj=obj[0];
        let summ=true;
        if(summary===obj[0].summary)
        {
            console.log("summary is same");
            summ=false;
        }
        
    }).catch(err=>{
        console.log(err);

    })
}
exports.get500=(req,res,next)=>{
    res.render('error');
}