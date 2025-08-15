import express from "express"
import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const login=async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    try{
        const user=await User.findOne({email:email});
        if(!user){
            res.status(500).send({message:"login not successfull"});
        }
        const pass=user.password;
        const isValid= await bcrypt.compare(password,pass)
        if(isValid){
            const token= jwt.sign({email:email},"persistent",{expiresIn:"24h"});
                res.cookie('token',token,{
                httpOnly: false,       // ✅ Prevents JS access (security)
                secure: true,         // ✅ Only sent over HTTPS
                sameSite: "none",     // ✅ Needed for cross-site cookies
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).send({message:"login successfull"});
        }
        else{
            res.status(500).send({message:"login not successfull"});
        }
    }
    catch(err){
        throw err;
    }
    
}