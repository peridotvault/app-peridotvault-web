"use client";

import * as React from "react";

type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
    const [bp, setBp] = React.useState<Breakpoint>("desktop");

    React.useEffect(() => {
        const mMobile = window.matchMedia("(max-width: 767px)");
        const mTablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
        const mDesktop = window.matchMedia("(min-width: 1024px)");

        const compute = () => {
            if (mMobile.matches) return "mobile";
            if (mTablet.matches) return "tablet";
            return "desktop";
        };

        const onChange = () => setBp(compute());

        // initial
        setBp(compute());

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
