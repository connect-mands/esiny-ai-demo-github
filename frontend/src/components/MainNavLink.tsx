import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { externalMainHref, isExternalMainSite } from "../config/env";

type Props = {
    to: string;
    className?: string;
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Marketing / site links: use router-relative paths (`/contact`, not `/ai/contact`).
 * When `VITE_MAIN_URL` is an http(s) origin, render a real `<a href>` to that site instead.
 */
export function MainNavLink({ to, className, children, onClick }: Props) {
    if (isExternalMainSite) {
        return (
            <a href={externalMainHref(to)} className={className} onClick={onClick}>
                {children}
            </a>
        );
    }
    return (
        <Link to={to} className={className} onClick={onClick}>
            {children}
        </Link>
    );
}
