"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDesktop,
    faPowerOff,
    faRotateRight,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { toastService } from "@/core/ui-system/toast/toast.service";
import { logoutEverywhere } from "@/features/auth/logout/logout.service";
import {
    formatSessionDate,
    listSessionsApi,
} from "@/features/auth/session/sessions.api";
import type { AuthSession } from "@/features/auth/session/session.type";

type LoadState =
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "ready"; sessions: AuthSession[] };

/**
 * "Your devices" + "Sign out all devices" (ANT-531).
 * Backed by GET /v1/auth/sessions (ANT-530). Renders explicit
 * loading / error(+retry) / empty / success states; responsive
 * (stacks on mobile) and announced via aria-live.
 */
export function SessionsSection() {
    const [state, setState] = useState<LoadState>({ kind: "loading" });
    const [signingOut, setSigningOut] = useState(false);
    const [confirming, setConfirming] = useState(false);
    // Bumped by Retry; the fetch effect below subscribes to it so no
    // setState call happens synchronously inside an effect body.
    const [reloadToken, setReloadToken] = useState(0);

    useEffect(() => {
        let cancelled = false;
        listSessionsApi().then(
            (sessions) => {
                if (!cancelled) setState({ kind: "ready", sessions });
            },
            (err: unknown) => {
                if (cancelled) return;
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to load sessions.";
                setState({ kind: "error", message });
            },
        );
        return () => {
            cancelled = true;
        };
    }, [reloadToken]);

    function retry() {
        setConfirming(false);
        setReloadToken((t) => t + 1);
    }

    async function onSignOutAll() {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        setSigningOut(true);
        try {
            await logoutEverywhere({ allDevices: true });
            toastService.success("Signed out everywhere", {
                desc: "All devices have been signed out of this account.",
            });
        } catch {
            toastService.error("Sign-out failed", {
                desc: "Please try again. Your local session was cleared.",
            });
            // Even if the server call failed, the local session is cleared
            // by logoutEverywhere — reload the (now signed-out) view.
            setReloadToken((t) => t + 1);
        } finally {
            setSigningOut(false);
            setConfirming(false);
        }
    }

    return (
        <section
            aria-label="Your devices"
            className="bg-card rounded-2xl border border-foreground/10 p-4 sm:p-6 flex flex-col gap-4 w-full"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Your devices</h2>
                    <p className="text-sm text-muted-foreground">
                        Sessions currently signed in to this account.
                    </p>
                </div>
                <ButtonWithSound
                    onClick={onSignOutAll}
                    disabled={signingOut}
                    aria-label={
                        confirming
                            ? "Confirm sign out all devices"
                            : "Sign out all devices"
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        confirming
                            ? "bg-chart-5 text-white hover:opacity-90"
                            : "ring ring-white/20 hover:bg-white/10"
                    }`}
                >
                    <FontAwesomeIcon icon={faPowerOff} aria-hidden="true" />
                    <span>
                        {signingOut
                            ? "Signing out…"
                            : confirming
                              ? "Tap again to confirm"
                              : "Sign out all devices"}
                    </span>
                </ButtonWithSound>
            </div>

            <div aria-live="polite">
                {state.kind === "loading" && <SessionsSkeleton />}

                {state.kind === "error" && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-2xl text-chart-5"
                            aria-hidden="true"
                        />
                        <p className="text-sm text-muted-foreground max-w-md">
                            Couldn&apos;t load your sessions. {state.message}
                        </p>
                        <ButtonWithSound
                            onClick={retry}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring ring-white/20 hover:bg-white/10 duration-300 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faRotateRight} aria-hidden="true" />
                            <span>Retry</span>
                        </ButtonWithSound>
                    </div>
                )}

                {state.kind === "ready" &&
                    (state.sessions.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No other sessions found. This is the only
                            device signed in.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {state.sessions.map((session) => (
                                <SessionRow
                                    key={session.id}
                                    session={session}
                                />
                            ))}
                        </ul>
                    ))}
            </div>
        </section>
    );
}

function SessionRow({ session }: { session: AuthSession }) {
    const seen = formatSessionDate(session.lastSeenAt);
    const created = formatSessionDate(session.createdAt);
    return (
        <li className="flex items-center gap-3 rounded-xl bg-accent/10 px-4 py-3">
            <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-highlight"
                aria-hidden="true"
            >
                <FontAwesomeIcon icon={faDesktop} />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                    {session.label}
                    {session.current && (
                        <span className="ml-2 rounded-full bg-chart-2/20 px-2 py-0.5 text-xs font-semibold text-chart-2">
                            This device
                        </span>
                    )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {[
                        session.ip ? `IP ${session.ip}` : null,
                        seen ? `Last active ${seen}` : null,
                        !seen && created ? `Since ${created}` : null,
                    ]
                        .filter(Boolean)
                        .join(" · ") || "Session details unavailable"}
                </p>
            </div>
        </li>
    );
}

function SessionsSkeleton() {
    return (
        <div
            className="flex flex-col gap-2"
            role="status"
            aria-label="Loading sessions"
        >
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-accent/10 px-4 py-3 animate-pulse"
                >
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-accent/20" />
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="h-3 w-2/5 rounded bg-accent/20" />
                        <div className="h-2.5 w-3/5 rounded bg-accent/20" />
                    </div>
                </div>
            ))}
        </div>
    );
}
