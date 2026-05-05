import mongoose, {Schema, model, Document} from "mongoose";

export interface Report extends Document {
    "summary_of_findings": string,
    "what_matters_most": string,
    "how_it_relates_to_symptoms": string,
    "questions_for_doctor": string[]
}

const reportSchema:Schema<Report> = new Schema({
    summary_of_findings: {type:String, required:true},
    what_matters_most: {type:String, required:true},
    how_it_relates_to_symptoms: {type:String, required:true},
    questions_for_doctor: {type:[String], required:true}
}) 

const Report = model<Report>("Report", reportSchema)

export default Report