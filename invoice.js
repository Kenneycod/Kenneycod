const easyinvoice = require('easyinvoice');
const fs = require('fs');
const express = require('express');
const app=express();
const mysql = require('mysql');
const path=require('path');
const db=require('./database');


app.get('/invoice',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','invoice.html'));
})

app.post('/invoice',(req,res)=>{
    var fname=req.body.fname;
    var surname=req.body.surname;
    var email=req.body.email;
    var company=req.body.company;
    var quantity=req.body.quantity;
    var amount=req.body.amount;

    var data = {

        "client": {
            "company": `${surname + fname}`,
            "address": email,
            "zip": "4567 CD",
            "city": "Clientcity",
            "country": "company",
        },
    
        "sender": {
            "company": surname,
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
                "price": amount-10
            },
            {
                "quantity": "4",
                "description": "Test2",
                "tax-rate": 21,
                "price": amount
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
        console.log(result.pdf);
    });

    let sql=(`INSERT INTO invoice (name,surname,email,company,quantity,amount) VALUES ("${fname}","${surname}","${email}","${company}","${quantity}","${price}")`);
    db.query(sql,(err,result)=>{
        if (err) {
            throw err;
        } else {
            console.log("Data inserted in invoice database..!");
        }
    });
});



module.exports=app;