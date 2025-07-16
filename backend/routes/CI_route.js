const express=require('express')
const ci_check=require('../controllers/CI_check.js')
const router=express.Router()

 router.post('/',ci_check)


 module.exports=router