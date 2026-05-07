import mongoose, { Schema, model, Document } from "mongoose";

interface Ifindings {
    heading: string,
    explanation: string
}

export interface Report extends Document {
    "summary": string,
    "findings": Ifindings[],
    "what_matters_most": string,
    "questions_for_doctor": string[],
    "iv": string
}

const reportSchema: Schema<Report> = new Schema({
    summary: { type: String, required: true },
    findings: [
        {
            heading: {
                type: String
            },
            explanation: {
                type: String
            }
        }
    ],
    what_matters_most: { type: String, required: true },
    questions_for_doctor: { type: [String], required: true },
    iv: { type: String }
})

const Report = model<Report>("Report", reportSchema)

export default Report