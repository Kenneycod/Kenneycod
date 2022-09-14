var mysql=require('mysql');
const dotenv =require('dotenv');
dotenv.config();

const db=mysql.createConnection({
    host:'localhost',
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:'mydb',
});

db.connect((err)=>{
    if (err) {
        console.log(err);
    } else {
        console.log('connected to Database....');

        /*let sql=`CREATE TABLE invoice (
            id int NOT NULL AUTO_INCREMENT UNIQUE,
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
            company VARCHAR(255) DEFAULT 'digitalTech',
            quantity int ,
            amount int,
            Date DATE DEFAULT CURRENT_DATE()
            )`;
        
        db.query(sql,(err,result)=>{
            if (err) {
                throw err;
            } else {
                console.log('Table created!');
            }
        });*/

        /*let sql=`TRUNCATE TABLE invoice`;
        db.query(sql,(err,result)=>{
            if (err) {
                throw err;
            } else {
                console.log('table is empty');
            }
        });*/
    }
});

module.exports=db;
