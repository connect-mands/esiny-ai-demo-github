import dotenv from "dotenv"

dotenv.config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
})

export const PORT = process.env.PORT || 3000
export const ANYTHING_PROJECT_TOKEN = process.env.ANYTHING_PROJECT_TOKEN || ""
export const OCR_API_KEY = process.env.OCR_API_KEY || ""  
export const MONGO_URI = process.env.MONGO_URI  
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "my-secret-key"