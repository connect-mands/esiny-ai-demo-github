import mongoose, { Schema, model, Document } from "mongoose";

export interface IPdf {
    "path": string,
    "iv": string,
    "authTag":string,
    "mimeType": string
}

export interface Report extends Document {
    "encryptedData": string,
    "iv": string,
    "authTag":string,
    "pdf": IPdf
}

const reportSchema: Schema<Report> = new Schema({
    encryptedData: {
        type: String,
        required: true,
    },

    iv: {
        type: String,
        required: true,
    },
    authTag: {
        type: String,
        required: true,
    },

    pdf: {
        path: String,
        authTag: String,
        iv: String,
        mimeType: String,
    },
}, { timestamps: true })

const Report = model<Report>("Report", reportSchema)

export default Report