import express, { Router } from "express";
import upload from "../../middleware/multer.js";
import { generateMRIReport, getMRIreportByID } from "../../controller/report.controller.js";

const reportRouter:Router = express.Router()

reportRouter.post("/",upload.single("file"), generateMRIReport)
reportRouter.get("/:id",getMRIreportByID)

export default reportRouter