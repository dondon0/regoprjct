const { request } = require("express");
const mysql=require("mysql");
const jwt= require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {promisify}= require('util');
const midtransClient = require('midtrans-client');

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let coreApi = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : process.env.MD_SK,
    clientKey : process.env.MD_CK
});

let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction : false,
    serverKey : process.env.MD_SK
});


exports.login= async (req,res)=>{
    try {
        const { email, password}= req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message:"Please enter email and password"
            })
        }

        db.query('SELECT * FROM users where email= ? ',[email],async (error,results)=>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                res.status(401).render('login',{
                    message:'Incorrect email or password'
                })
            }
            else{
                const id= results[0].id;

                const token= jwt.sign({ id }, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("Token is: "+token);

                const cookieOptions={
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/profile");
            }

        })


    } catch (error) {
        console.log(error);
    }
}

exports.sellerlogin= async (req,res)=>{
    try {
        const { email, password}= req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message:"Please enter email and password"
            })
        }

        db.query('SELECT * FROM sellers where email= ? ',[email],async (error,results)=>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                res.status(401).render('login',{
                    message:'Incorrect email or password'
                })
            }
            else{
                const id= results[0].id;

                const token= jwt.sign({ id }, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("Token is: "+token);

                const cookieOptions={
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/sellerprofile");
            }

        })


    } catch (error) {
        console.log(error);
    }
}
    


exports.register= (req,res)=>{
    console.log(req.body);

    const {username,email,password,passwordConfirm}=req.body;

    
       

    db.query('SELECT email FROM users WHERE email = ?',[email], async(error, results)=>{
        
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render('register',{
                message:'Email is already used'
            });
        }
        else if(password !==passwordConfirm){
            return res.render('register',{
                message:'Password does not match'
            });
        }
        
        let hashedPassword= await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ? ',{username:username, email:email, password:hashedPassword}, (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                return res.render('register',{
                    message:'User Registered'
                });
            }
        });

    });
    

    
}

exports.sellerregister= (req,res)=>{
    console.log(req.body);

    const {username,email,password,passwordConfirm}=req.body;

    
       

    db.query('SELECT email FROM sellers WHERE email = ?',[email], async(error, results)=>{
        
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render('register',{
                message:'Email is already used'
            });
        }
        else if(password !==passwordConfirm){
            return res.render('register',{
                message:'Password does not match'
            });
        }
        
        let hashedPassword= await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO sellers SET ? ',{username:username, email:email, password:hashedPassword}, (error,results)=>{
            if(error){
                console.log(error);
            }
            else{
                return res.render('sellerlogin',{
                    message:'User Registered'
                });
            }
        });

    });
    

    
}


exports.isLoggedin= async (req,res,next)=>{
    //console.log(req.cookies);/*Getting cookies from browser
    if(req.cookies.jwt){
        try {
            //verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
                );
            
                console.log(decoded);

                //check user exists in db
                db.query('SELECT * FROM users WHERE id = ? ',[decoded.id], (error,result)=>{
                    console.log(result);
                    if(!result){
                        return next();
                    }

                    req.user= result[0];
                    return next();
                })
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        next();
    }
    
}

exports.sellerisLoggedin= async (req,res,next)=>{
    //console.log(req.cookies);/*Getting cookies from browser
    if(req.cookies.jwt){
        try {
            //verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
                );
            
                console.log(decoded);

                //check user exists in db
                db.query('SELECT * FROM sellers WHERE id = ? ',[decoded.id], (error,result)=>{
                    console.log(result);
                    if(!result){
                        return next();
                    }

                    req.seller= result[0];
                    const sell= req.seller;
                    // db.query('select * from products where sellerid=?',[req.seller.id],(error,results)=>{
                    //     console.log(results)
                    //     if(!results){
                    //         return next();
                    //     }
                    //     var length=results.length;
                    //     console.log(length);
                        
                    //     req.results=results[0];

                        
                    // })
                    
                    return next();
                })
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        next();
    }
    
}

exports.logout= async (req,res,next)=>{
    res.cookie('jwt', 'logout',{
        expires: new Date(Date.now()+ 2*1000),
        httpOnly:true
    });

    res.status(200).redirect('/')
}

exports.addproduct= (req,res)=>{
    console.log(req.body);

    const {productname,price,sellerid}=req.body;

    db.query('insert into products SET ?',{productname:productname, price:price, sellerid:sellerid}, (error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            return res.render('addproduct',{
                message:'Product Added!'
            });
        }
    })

    
}

exports.removeitem= (req,res,next)=>{
    

    const {id}=req.body;    
    console.log(req.body);
    
    db.query('select * from products where productid=?',[id],async(err,res)=>{
        if(err){
            console.log(err);
        }
        if(res.length<1){
            return res.render('sellerprofile',{
                message:'You have no products with that id'

            });
            
        }
    })
    
    db.query('delete from products where productid =?',[id],(error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            return res.render('sellerprofile',{
                message:'Product Deleted! Please Re-access your profile to view changes'
                
            });
            
        }
    })

    
}



