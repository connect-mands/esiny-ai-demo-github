import { Request, Response } from "express";
import { extractTextWithOCRSpace } from "../services/extraction.service.js";
import { analyzeMRI } from "../services/ai.service.js";
import { stripPHI } from "../utils/sanitizer.js";
import Report from "../model/report.schema.js";
import { dbLogger } from "../utils/logger.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { encryptBuffer } from "../utils/encryption.js";


export const generateMRIReport = async (req: Request, res: Response) => {
    try {
        const file = req.file
        let reportText = req.body.reportText || "";
        const symptoms = req.body.symptoms || "";

        if (!reportText && !file) {
            return res.status(400).json({
                message: "Please provide a report text or upload a file.",
                success: false
            })
        }

        const cleanedText = stripPHI(reportText);

        const aiResult = await analyzeMRI({
            reportText: cleanedText,
            symptoms,
        });
        if (aiResult?.ok === false) {
            throw new Error(aiResult.error);
        }

        let iv = "";

        if (file) {
            const encBuffer = encryptBuffer(file.buffer);
            iv = encBuffer.iv;
            await fs.writeFile(`uploads/${iv}.pdf`, encBuffer.data);

            reportText = await extractTextWithOCRSpace(
                file.buffer,
                file.mimetype
            );
        }

        const report = await Report.create({
            summary_of_findings: aiResult.summary_of_findings || "",
            what_matters_most: aiResult.what_matters_most || "",
            how_it_relates_to_symptoms:
                aiResult.how_it_relates_to_symptoms || "",
            questions_for_doctor: aiResult.questions_for_doctor || [],
            iv: iv,
        });

        return res.status(200).json({
            message: "Report generated successfully",
            success: true,
            data: {
                response: report,
                reportId: report._id,
                reportUrl: `http://localhost:5000/api/report/${report._id}`,
            },
        });
    } catch (error: any) {
        console.error("Error generating report:", error);
        dbLogger.error("Report generation failed", {
            error: error.message,
        });
        return res.status(500).json({
            message: "Error generating report",
            success: false
        })
    }
}

export const getMRIreportByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            dbLogger.error("Report retrieval failed", {
                error: "Invalid report ID",
            });
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "please provide report id"
            })
        }

        const report = await Report.findById(id)

        return res.status(200).json({
            success: true,
            report
        })

    } catch (error: any) {
        console.error("Error generating report:", error);
        dbLogger.error("Report retrieval failed", {
            error: error.message,
        });
        return res.status(500).json({
            message: `${error}`,
            success: false
        })
    }
}