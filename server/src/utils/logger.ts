import Log from "../model/log.schema.js";


export const dbLogger = {
    info: async (message: string, meta?: any) => {
        await Log.create({ level: "info", message, meta });
    },

    warn: async (message: string, meta?: any) => {
        await Log.create({ level: "warn", message, meta });
    },

    error: async (message: string, meta?: any) => {
        await Log.create({ level: "error", message, meta });
    },
};