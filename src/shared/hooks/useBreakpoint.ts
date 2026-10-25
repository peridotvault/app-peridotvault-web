"use client";

import * as React from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

function getBreakpoint(): Breakpoint {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
    if (window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches) return "tablet";
    return "desktop";
}

export function useBreakpoint(): Breakpoint {
    const [bp, setBp] = React.useState<Breakpoint>(() => getBreakpoint());

    React.useEffect(() => {
        const mMobile = window.matchMedia("(max-width: 767px)");
        const mTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
        const mDesktop = window.matchMedia("(min-width: 1024px)");

        const onChange = () => setBp(getBreakpoint());

        // subscribe
        mMobile.addEventListener("change", onChange);
        mTablet.addEventListener("change", onChange);
        mDesktop.addEventListener("change", onChange);

        return () => {
            mMobile.removeEventListener("change", onChange);
            mTablet.removeEventListener("change", onChange);
            mDesktop.removeEventListener("change", onChange);
        };
    }, []);

    return bp;
}
