import express from 'express'
import ci_check from '../controllers/CI_check.js';
const router1=express.Router()

 router1.post('/',ci_check)


export default router1;