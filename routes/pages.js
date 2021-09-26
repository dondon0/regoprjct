const express= require("express");
const authController= require('../controllers/auth.js');
const router= express.Router();
const mysql=require("mysql");

const mdck= process.env.MD_CK;
const mdsk= process.env.MD_SK;

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', authController.isLoggedin,authController.sellerisLoggedin, (req,res)=>{
    if(req.user){
        
        db.query('select * from products order by productid;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
            }
            else{
                res.render('index',{
                    user:req.user,
                    dbres:result
                });
            }
        })
    }
    else if(req.seller){
        res.render('index',{
            seller:req.seller
        });
    }
    else{
        db.query('select * from products order by productid;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
            }
            else{
                res.render('index',{
                    dbres:result
                });
            }
        })
    }
})

router.get('/register',(req,res)=>{
    res.render('register');
})

router.get('/sellerregister',(req,res)=>{
    res.render('sellerregister');
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/seller',(req,res)=>{
    res.render('sellerlogin');
})

router.get('/profile',authController.isLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.user){
        db.query('select * from products order by productid;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
            }
            else{
                res.render('profile',{
                    user:req.user,
                    dbres:result
                });
            }
        })
        
    }
    else{
        res.redirect('/login')
    }
    
})

router.get('/sellerprofile', authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        db.query('select * from products where sellerid=?',[req.seller.id],(error,results)=>{
            console.log(results);
            if(error){
                console.log(error);
            }
            else{
                res.render('sellerprofile',{
                    seller:req.seller,
                    dbres:results
                });
            }
        })

    }
    
    else{
        res.redirect('/seller')
    }
    
})

router.get('/sellerproducts',authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        res.render('sellerproducts',{
            seller:req.seller,
            
        });
    }
    else{
        res.redirect('/seller')
    }
    
})



router.get('/addproduct',authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        res.render('addproduct',{
            seller:req.seller
        });
    }
    else{
        res.redirect('/seller')
    }
    
})





module.exports=router;