import { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, BRAND_TAGLINE } from "./cons";

export const METADATA: Metadata = {
    metadataBase: new URL(SITE_URL),

    // Title yang bagus untuk SEO: brand + template per halaman
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },

    // Deskripsi global (akan dipakai jika page tidak override)
    description: DEFAULT_DESCRIPTION,

    // Kata kunci (tidak terlalu “powerful” di Google modern, tapi tidak masalah untuk kelengkapan)
    keywords: DEFAULT_KEYWORDS,

    // Branding / ownership
    applicationName: SITE_NAME,
    creator: "PeridotVault",
    publisher: "PeridotVault",

    // Jika kamu punya halaman kategori utama
    category: "Technology",

    // Canonical & alternates
    alternates: {
        canonical: "/",
        // Jika nanti kamu punya versi bahasa:
        // languages: { "en": "/en", "id": "/id" },
    },

    // Robots (atur sesuai kebutuhan)
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    // Open Graph (untuk share di WhatsApp/FB/Discord/Slack, dll)
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [
            {
                url: "/og/peridotvault-og.png", // pastikan file ini ada di /public/og/
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} — ${BRAND_TAGLINE}`,
            },
        ],
        locale: "en_US",
    },

    // Twitter cards
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: ["/og/peridotvault-og.png"],
        // kalau ada handle:
        // site: "@peridotvault",
        // creator: "@peridotvault",
    },

    // Icons & manifest
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
        shortcut: ["/favicon.ico"],
    },
    manifest: "/site.webmanifest",

    // Format detection untuk iOS (mencegah auto-link nomor/email)
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    // Apple web app capabilities (opsional, tapi rapi)
    appleWebApp: {
        capable: true,
        title: SITE_NAME,
        statusBarStyle: "default",
    },

    // Jika kamu punya domain lain (marketing) dan ingin relasi:
    // referrer: "origin-when-cross-origin",

    // Verification (isi kalau sudah punya token)
    // verification: {
    //   google: "GOOGLE_SEARCH_CONSOLE_TOKEN",
    //   yandex: "YANDEX_TOKEN",
    //   other: { "msvalidate.01": ["BING_TOKEN"] },
    // },

    // Additional meta yang kadang berguna
    other: {
        "x-ua-compatible": "IE=edge",
    },
};