import express, { Router,Request, Response } from "express";
import reportRouter from "./report.route.js";

const v1Router:Router = express.Router()

v1Router.use("/report", reportRouter)

v1Router.use("/",(_req:Request,res:Response) => {
    console.log("Welcome to v1 Api Route")
    res.status(200).json({
        message:"Welcome to v1 Api Route",
        sucess:true
    })
})  

export default v1Router