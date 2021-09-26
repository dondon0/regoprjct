const express= require("express");
const authController= require('../controllers/auth');
const router= express.Router();

router.post('/register',authController.register)
router.post('/sellerregister',authController.sellerregister)
router.post('/login', authController.login);
router.post('/seller', authController.sellerlogin);
router.post('/sellerprofile', authController.removeitem);
router.get('/logout', authController.logout);
router.post('/addproduct',authController.addproduct);



module.exports=router;