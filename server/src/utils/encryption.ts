import crypto from "crypto";
import { ENCRYPTION_KEY } from "../config/server.config.js";

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = crypto
    .createHash("sha256")
    .update(ENCRYPTION_KEY)
    .digest();

export const encryptBuffer = (buffer: Buffer) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final(),
    ]);

    return {
        iv: iv.toString("hex"),
        data: encrypted,
    };
};

export const decryptBuffer = (encryptedData: Buffer, ivHex: string) => {
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);

    const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
    ]);

    return decrypted;
};