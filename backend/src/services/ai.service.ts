import { dbLogger } from "../utils/logger.js";
import { getAIResponse } from "../infra/ai.client.js";
import { prompt } from "../lib/prompt.js";

export const analyzeMRI = async ({
    reportText,
    symptoms,
}: {
    reportText: string;
    symptoms: string;
}) => {
    try {
        const response: any = await getAIResponse(prompt, reportText, symptoms)
        const text =
            response.data?.choices?.[0]?.message?.content ||
            response.data?.message ||
            "";

        const match = text.match(/\{[\s\S]*\}/);

        if (!match) {
            dbLogger.error("AI service error", {
                error: "Invalid AI response format",
            });
            throw new Error("Invalid AI response format");
        }

        const parsed = JSON.parse(match[0]);

        return parsed;

    } catch (error: any) {
        console.error("AI Error:", error?.response?.data || error.message);
        dbLogger.error("AI service error", {
            error: error.message,
        });
        return {
            ok: false,
            error: error.message,
        };
    }
};