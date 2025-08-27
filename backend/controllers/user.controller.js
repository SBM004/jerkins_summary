import express from "express"
import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const login=async(req,res)=>{
    const email=req.body.email;
    // const username=req.body.email
    const password=req.body.password;
    let user
    try{
        if(email.includes("@")){

            user=await User.findOne({email:email});
        }
        else{
            user=await User.findOne({username:email});
        }
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

export const signup=async(req,res)=>{
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    try{
        const user=await User.findOne({email:email});
        if(user){
            return res.status(500).json({message:"email already used"});
        }
        const user2=await User.findOne({username:username});
        if(user2){
            return res.status(500).json({message:"username already used"});
        }
        const pass= await  bcrypt.hash(password,10)
        const result= await User.create({ email: email,username:username, password: pass })
        console.log(result)
        if(result){
            return res.status(200).send({message:"success"})
        }
        else{
            return res.status(500).json({message:"something went wrong"});
        }
    }
    catch(err){

        throw err;
    }
    
}
