import axios from "axios";
import { ANYTHING_PROJECT_TOKEN } from "../config/server.config.js";
import { dbLogger } from "../utils/logger.js";

export const analyzeMRI = async ({
    reportText,
    symptoms,
}: {
    reportText: string;
    symptoms: string;
}) => {
    try {
        const response = await axios.post(
            "https://f8f09d02-c158-4714-a930-10f892c214b2.created.app/integrations/google-gemini-2-5-pro/",
            {
                messages: [
                    {
                        role: "system",
                        content: `
You are a friendly doctor explaining an MRI report to a patient in simple language.

STRICT RULES:
- Do NOT diagnose
- Do NOT predict diseases
- Do NOT give treatment advice
- ONLY explain findings
- Use very simple, everyday English
- Avoid medical jargon (or explain it simply if needed)
- Keep sentences short and clear
- Make it feel like a human conversation

STYLE:
- Talk like you are speaking directly to the patient
- Use reassuring and calm tone
- Use simple analogies if helpful (like "pressure on a nerve is like a pinched wire")

OUTPUT FORMAT (JSON ONLY):
{
  "summary_of_findings": "",
  "what_matters_most": "",
  "how_it_relates_to_symptoms": "",
  "questions_for_doctor": []
}

CONTENT RULES:
- Each section should be short (2–4 lines max)
- "questions_for_doctor" should be simple and natural
- Avoid complex words like "degenerative", "impingement" (or explain them simply)
`,
                    },
                    {
                        role: "user",
                        content: `
MRI REPORT:
${reportText}

SYMPTOMS:
${symptoms || "Not provided"}
`,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ANYTHING_PROJECT_TOKEN}`,
                },
            }
        );

        const text =
            response.data?.choices?.[0]?.message?.content ||
            response.data?.message ||
            "";

        const match = text.match(/\{[\s\S]*\}/);

        if (!match) {
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