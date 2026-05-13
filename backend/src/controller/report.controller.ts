import { Request, Response } from "express";
import { extractTextWithOCRSpace } from "../services/extraction.service.js";
import { analyzeMRI } from "../services/ai.service.js";
import { stripPHI } from "../utils/sanitizer.js";
import Report, { IPdf } from "../model/report.schema.js";
import { dbLogger } from "../utils/logger.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { decryptJson, encryptBuffer, encryptJson, getExtension } from "../utils/crypto.js";


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

        let pdfData: IPdf = {
            path: "",
            iv: "",
            authTag: "",
            mimeType: "",
        };

        if (file) {
            const encBuffer = encryptBuffer(file.buffer);
            const ext = getExtension(file.mimetype);
            await fs.writeFile(`./uploads/${encBuffer.iv}.${ext}`, encBuffer.encryptedBuffer);

            pdfData = {
                path: `uploads/${encBuffer.iv}`,
                iv: encBuffer.iv,
                authTag: encBuffer.authTag,
                mimeType: file.mimetype,
            };

            reportText = await extractTextWithOCRSpace(
                file.buffer,
                file.mimetype
            );
        }

        const jsonReport = {
            summary: aiResult.summary || "",
            findings: aiResult?.findings || [],
            what_matters_most: aiResult.what_matters_most || "",
            questions_for_doctor: aiResult.questions_for_doctor || []
        }

        const encryptedReport = encryptJson(jsonReport);

        const report: any = await Report.create({
            encryptedData: encryptedReport.encryptedData,
            iv: encryptedReport.iv,
            authTag: encryptedReport.authTag,
            pdf: pdfData,
        });

        return res.status(200).json({
            message: "Report generated successfully",
            success: true,
            data: {
                report,
                reportId: report._id,
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

        const report: any = await Report.findById(id)

        const decryptedJson = decryptJson({
            encryptedData: report.encryptedData,
            iv: report.iv,
            authTag: report.authTag,
        });

        return res.status(200).json({
            success: true,
            report: decryptedJson
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