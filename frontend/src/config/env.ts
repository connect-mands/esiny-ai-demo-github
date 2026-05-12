function trimOrEmpty(value: string | undefined): string {
    return (value ?? "").trim();
}

const defaultApiBase = "http://localhost:5000/api/v1";

/** Backend REST API base URL (must include `/api/v1`, no trailing slash). */
export const apiBaseUrl =
    trimOrEmpty(import.meta.env.VITE_BASE_URL) || defaultApiBase;

/**
 * Main marketing site origin for cross-links (no trailing slash).
 * Leave empty when routes are served from this same app.
 */
export const mainSiteBaseUrl = trimOrEmpty(import.meta.env.VITE_MAIN_URL);
