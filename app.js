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

/*invoice page
app.get('/invoice',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','invoice.html'));
})

app.post('/invoice',(req,res)=>{
    var name=req.body.name;
    var surname=req.body.surname;
    var email=req.body.email;
    var company=req.body.company;
    var quantity=req.body.quantity;
    var amount=req.body.amount;

var data = {

    "client": {
        "company": `"${name}`+`${surname}"`,
        "address": `"${email}"`,
        "zip": "4567 CD",
        "city": "Clientcity",
        "country": `"${company}"`
    },

    "sender": {
        "company": "Ken Tech",
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "Sampletown",
        "country": "Samplecountry"
    },

    "images": {
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
    },

    "information": {
        // Invoice number
        "number": "2021.0001",
        // Invoice data
        "date": "12-12-2021",
        // Invoice due date
        "due-date": "31-12-2021"
    },

    "products": [
        {
            "quantity": "2",
            "description": "Test1",
            "tax-rate": 6,
            "price": 33.87
        },
        {
            "quantity": "4",
            "description": "Test2",
            "tax-rate": 21,
            "price": 10.45
        }
    ],

    "bottomNotice": "Kindly pay your invoice within 15 days.",

    "settings": {
        "currency": "USD", 
    },
    
    "customize": {
        //"template": fs.readFileSync('template.html', 'base64') //mkkln
    },
};

easyinvoice.createInvoice(data, function (result) {
    const readfile = fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
});

    let sql=(`INSERT INTO invoice (name,surname,email,company,quantity,amount) VALUES ("${name}","${surname}","${email}","${company}","${data.products.quantity}","${data.products.price}")`);
    db.query(sql,(err,result)=>{
        if (err) {
            throw err;
        } else {
            console.log("Data inserted in invoice database..!");
        }
    });
    res.sendFile(path.join(__filename,'readfile.text'));
})
*/
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
