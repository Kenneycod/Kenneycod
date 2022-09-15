//npm - Libary used 
const express=require('express');
const mysql=require('mysql');
const db=require('./database');
const path=require('path');
const bodyparser=require('body-parser');
const app=express();
const nodemailer=require('nodemailer');
const { join } = require('path');
const easyinvoice=require('easyinvoice');
const fs=require('fs');
const dotenv = require('dotenv').config();
const invoiceRoute = require('./invoice');

//creating mail transporter
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.ADDRESS,
        password:process.env.E_PASSWORD,
    }
});

app.use(invoiceRoute);
app.use(bodyparser.urlencoded({extended:false}));
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false}));

//display login page
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'public', 'login.html'));
});

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'public', 'register.html'));
});

//registeration - inserting data into our database
app.post('/register',(req,res)=>{
    var firstname = req.body.firstname;
    var lastname=req.body.lastname;
    var email=req.body.email;
    var password = req.body.password;

    const sql=(`INSERT INTO clients (Firstname,Lastname,Email,Password) VALUES ("${firstname}","${lastname}","${email}","${password}")`);
    db.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        else{
            console.log('successfully added');
            //res.send('successfully registered');
            res.redirect('/login');
        }
    });
     
    //sending mail to user

    /*const mailOptions = {
        from:'190601004@rdu.edu.tr',
        to:`${email}`,
        subject:'Kennedycode',
        Text:'Your account has been successfully created!',
    };

    transporter.sendMail(mailOptions,(err,info)=>{
        if (err) {
            throw err;
        } else {
            console.log('Email sent:'+info.response);
        }
    });*/
});

//login - 
app.post('/login',(req,res)=>{
    var email=req.body.email;
    var password = req.body.password;

    const sql=(`SELECT * FROM clients WHERE Email = "${email}" AND Password = "${password}"`);
    db.query(sql,(err,result)=>{
        if (err) {
            res.send('make sure your email and password is correct');
            res.redirect('/login');
        } else {
            res.send('welcome Back');
        }
    });
});

//creating listening port
app.listen(process.env.PORT,(err)=>{
    if (err) {
        throw err;
    } else {
        console.log('server is running......');
    }
});