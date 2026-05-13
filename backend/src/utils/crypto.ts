import crypto from "crypto";
import { ENCRYPTION_KEY } from "../config/server.config.js";

const ALGORITHM = "aes-256-gcm";


const SECRET_KEY = crypto
    .createHash("sha256")
    .update(ENCRYPTION_KEY)
    .digest();


// ======================================================
// JSON / TEXT ENCRYPTION
// ======================================================

export const encryptJson = (data: unknown) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        SECRET_KEY,
        iv
    );

    const stringData = JSON.stringify(data);

    const encrypted = Buffer.concat([
        cipher.update(stringData, "utf8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        encryptedData: encrypted.toString("hex"),
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
    };
};


export const decryptJson = ({
    encryptedData,
    iv,
    authTag,
}: {
    encryptedData: string;
    iv: string;
    authTag: string;
}) => {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        SECRET_KEY,
        Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(authTag, "hex")
    );

    const decrypted = Buffer.concat([
        decipher.update(
            Buffer.from(encryptedData, "hex")
        ),
        decipher.final(),
    ]);

    return JSON.parse(
        decrypted.toString("utf8")
    );
};



// ======================================================
// BUFFER / PDF / IMAGE ENCRYPTION
// ======================================================

export const encryptBuffer = (
    buffer: Buffer
) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        SECRET_KEY,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return {
        encryptedBuffer: encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
    };
};



export const decryptBuffer = ({
    encryptedBuffer,
    iv,
    authTag,
}: {
    encryptedBuffer: Buffer;
    iv: string;
    authTag: string;
}) => {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        SECRET_KEY,
        Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(authTag, "hex")
    );

    return Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
    ]);
};



// ======================================================
// FILE EXTENSION HELPER
// ======================================================

export const getExtension = (
    mimetype: string
) => {
    if (mimetype === "application/pdf")
        return "pdf";

    if (mimetype === "image/png")
        return "png";

    if (mimetype === "image/jpeg")
        return "jpg";

    return "bin";
};