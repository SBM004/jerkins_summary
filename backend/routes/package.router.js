import mongoose from "mongoose"
import express from "express";
import {data} from "../controllers/package.controller.js";
const router=express.Router()

router.get("/",data);


export default router;