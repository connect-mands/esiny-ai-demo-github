export const stripPHI = (text: string): string => {
    let sanitized = text;

    // 📧 Emails
    sanitized = sanitized.replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "[EMAIL]"
    );

    // 📞 Phone numbers
    sanitized = sanitized.replace(
        /\b(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
        "[PHONE]"
    );

    // 📅 Dates (various formats)
    sanitized = sanitized.replace(
        /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/g,
        "[DATE]"
    );

    // 🆔 MRN / IDs
    sanitized = sanitized.replace(
        /\b(MRN|Patient ID|ID)[:\s]*\w+\b/gi,
        "[ID]"
    );

    // 🏥 Common prefixes (Dr., Mr., Mrs.)
    sanitized = sanitized.replace(
        /\b(Dr|Mr|Mrs|Ms)\.?\s+[A-Z][a-z]+\b/g,
        "[NAME]"
    );

    // 📍 Addresses (basic pattern)
    sanitized = sanitized.replace(
        /\d{1,5}\s[A-Za-z0-9\s,]+\b(Road|Street|Ave|Lane|Rd|St)\b/gi,
        "[ADDRESS]"
    );

    return sanitized;
};