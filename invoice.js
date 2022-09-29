const easyinvoice = require('easyinvoice');
const fs = require('fs');
const express = require('express');
const app=express();
const mysql = require('mysql');
const path=require('path');
const {join} = require('path');
const db=require('./database');
const bodyparser=require('body-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/invoice',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','invoice.html'));
})

app.post('/invoice',(req,res)=>{
    console.log(req.body);
    var name=req.body.name;
    var surname=req.body.surname;
    var email=req.body.email;
    var company=req.body.company;
    var quantity=req.body.quantity;
    var amount=req.body.amount;
    var country=req.body.country;

    var data = {

        "client": {
            "company": company,
            "address": email,
            "zip": "4567 CD",
            "city": "Clientcity",
            "country": country,
        },
    
        "sender": {
            "company": surname,
            "address": "Sample Street 123",
            "zip": "1234 AB",
            "city": "Istanbul",
            "country": "Turkey"
        },
    
        "images": {
            logo: "https://seeklogo.com/images/C/Comtech-logo-4399F53167-seeklogo.com.png?v=637769858510000000",
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
                "quantity": quantity,
                "description": "Test1",
                "tax-rate": 6,
                "price": amount
            },
            {
                "quantity": quantity,
                "description": "Test2",
                "tax-rate": 21,
                "price": amount
            }
        ],
    
        "bottomNotice": "Kindly pay your invoice before month end.",
    
        "settings": {
            "currency": "TRY", 
        },
        
        "customize": {
            //"template": fs.readFileSync('template.html', 'base64') //mkkln
        },
    };
    
    easyinvoice.createInvoice(data, function (result) {
        const readfile = fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
        let sql=(`INSERT INTO invoice (name,surname,email,company,quantity,amount) VALUES ("${name}","${surname}","${email}","${company}","${quantity}","${amount}")`);
    db.query(sql,(err,result)=>{
        if (err) {
            throw err;
        } else {
            console.log("Data inserted in invoice database..!");
            res.sendFile(path.join(__dirname,'invoice.pdf'));
        }
    });
    });
});



module.exports=app;