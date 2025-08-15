import express from "express"
import mongoose from "mongoose"
import Package from "../model/Package.model.js";

export const data=async(req,res)=>{
    try{
        const data=await Package.find();
        if(data.length!=0){

            return res.status(200).json(data);
        }
        else{
             return res.status(200).send({message:"no data"});
        }
    }
    catch(err){
        throw err;
    }
}