import { ocrSpace } from "ocr-space-api-wrapper";
import { OCR_API_KEY } from "../config/server.config.js";
import { dbLogger } from "../utils/logger.js";

export const extractTextWithOCRSpace = async (
    buffer: Buffer,
    mimetype: string
): Promise<string> => {
    try {
        const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;

        const result = await ocrSpace(base64, {
            apiKey: OCR_API_KEY,
            isOverlayRequired: false,
            language: "eng",
        });

        const parsedText =
            result?.ParsedResults?.[0]?.ParsedText || "";

        return parsedText;
    } catch (error: any) {
        console.error("OCR Space Error:", error);
        dbLogger.error("OCR service error", {
            error: error.message,
        });
        throw new Error("OCR failed");
    }
};