const express = require("express");
const path=require("path");
const mysql=require("mysql");
const dotenv= require("dotenv");
const cookieParser= require("cookie-parser");
const hbs= require('hbs');
const midtransClient = require('midtrans-client');
const mongoose= require('mongoose');

dotenv.config({path:'./.env'});

const app= express()

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});





const publicDir= path.join(__dirname, './public');
app.use(express.static(publicDir));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');



hbs.registerHelper('if_eq', function(a, b, opts) {
    if(a == b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});

db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("MySQL Connected");
    }
}) 

//Defining Routes
app.use('/', require('./routes/pages.js'));
app.use('/auth',require('./routes/auth'));

app.listen(5005,()=>{
    console.log("Server started on port 5005");
})