import dotenv from "dotenv"
import axios from "axios"

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
})

const AI_URL = process.env.AI_URL || ''
const ANYTHING_PROJECT_TOKEN = process.env.ANYTHING_PROJECT_TOKEN

export const getAIResponse = async (prompt: string, reportText: string, symptoms: string) => {
    try {
        const response = await axios.post(
            AI_URL,
            {
                messages: [
                    {
                        role: "system",
                        content: prompt,
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
        return response
    } catch (error) {
        throw new Error("Failed to get AI response: " + (error as any).message);
    }
}