// src/model/log.schema.ts
import { Schema, model, Document } from "mongoose";

export interface Log extends Document {
  level: "info" | "warn" | "error";
  message: string;
  meta?: any;
}

const logSchema = new Schema<Log>(
  {
    level: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Log = model<Log>("Log", logSchema);

export default Log;