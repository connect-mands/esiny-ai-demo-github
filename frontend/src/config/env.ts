function trimOrEmpty(value: string | undefined): string {
    return (value ?? "").trim();
}

const defaultApiBase = "http://localhost:5000/api/v1";

/** Backend REST API base URL (must include `/api/v1`, no trailing slash). */
export const apiBaseUrl =
    trimOrEmpty(import.meta.env.VITE_BASE_URL) || defaultApiBase;

/**
 * Main marketing site origin for cross-links (no trailing slash).
 * Use an `https://` origin to open those URLs in a full page navigation via `<a href>`.
 * Leave empty when links should stay in this SPA (paths are basename-relative, e.g. `/contact`).
 */
export const mainSiteBaseUrl = trimOrEmpty(import.meta.env.VITE_MAIN_URL);

export const isExternalMainSite = /^https?:\/\//i.test(mainSiteBaseUrl);

export function externalMainHref(path: string): string {
    const base = mainSiteBaseUrl.replace(/\/+$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
}

const rawViteBase = trimOrEmpty(import.meta.env.BASE_URL) || "/";
/** Vite `base` without trailing slash, e.g. `/ai`. Empty when `base` is `/`. */
export const appBasePath =
    rawViteBase === "/" ? "" : rawViteBase.replace(/\/+$/, "");

/** Path as served on the host, including Vite base — for share URLs (e.g. `/ai/report/…`). */
export function publicAppPath(path: string): string {
    const p = path.startsWith("/") ? path : `/${path}`;
    if (!appBasePath) return p;
    return `${appBasePath}${p}`;
}

/** Full URL for sharing a route under this app’s public base. */
export function appShareUrl(path: string): string {
    if (typeof window === "undefined") return publicAppPath(path);
    return `${window.location.origin}${publicAppPath(path)}`;
}

/**
 * Full document URL to the SPA homepage plus a hash (Vite `BASE_URL` + `#fragment`).
 * Use for `<a href>` so `/ai/why-endoscopic` routes are avoided when only `/` is registered.
 */
export function homeSectionHref(fragment: string): string {
    const id = fragment.replace(/^#/, "");
    const raw = trimOrEmpty(import.meta.env.BASE_URL) || "/";
    const withSlash = raw.endsWith("/") ? raw : `${raw}/`;
    return `${withSlash}#${id}`;
}

/** Turn a route like `/what-we-treat` into a safe fragment id `what-we-treat`. */
export function pathToHomeHashFragment(routePath: string): string {
    return routePath
        .replace(/^\//, "")
        .replace(/\//g, "-")
        .replace(/\./g, "-");
}

/** Marketing paths: full main-site URL when `VITE_MAIN_URL` is https, else same-origin hash on the SPA home. */
export function spaOrExternalPathHref(routePath: string): string {
    if (isExternalMainSite) return externalMainHref(routePath);
    return homeSectionHref(pathToHomeHashFragment(routePath));
}
