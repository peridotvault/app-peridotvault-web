"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/features/auth/_store/auth.store";
import { authRepo } from "@/core/db/repositories/auth.repo";
import { short } from "@/shared/utils/customAccountId";
import { SessionsSection } from "@/features/auth/session/components/SessionsSection";

/* ======================================================
   PAGE — My Profile (Protected)
   Account summary + "Your devices" sessions list (ANT-531).
   Peridot navigation-only login flow is unchanged: logged-out
   users are prompted to connect from the Navbar.
   ====================================================== */

export default function MyProfile() {
    const authStatus = useAuthStore((s) => s.status);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [resolving, setResolving] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const session = await authRepo.getSession();
                if (!cancelled) setAccountId(session?.account_id ?? null);
            } catch {
                if (!cancelled) setAccountId(null);
            } finally {
                if (!cancelled) setResolving(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authStatus]);

    if (authStatus === "anonymous" || (!resolving && !accountId)) {
        return (
            <main className="max-w-400 w-full mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faLock}
                            className="text-3xl text-muted-foreground"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">
                            View Your Profile
                        </h1>
                        <p className="text-muted-foreground max-w-md">
                            Connect your wallet to view your profile and
                            manage the devices signed in to your account.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                        <span>
                            Click the Connect button in the top right to get
                            started
                        </span>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-400 w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
            <section
                aria-label="Account summary"
                className="bg-card rounded-2xl border border-foreground/10 p-4 sm:p-6 flex items-center gap-4"
            >
                <div
                    className="w-14 h-14 shrink-0 rounded-lg bg-accent flex items-center justify-center text-highlight text-xl font-black"
                    aria-hidden="true"
                >
                    <span>@</span>
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl font-semibold truncate">
                        {resolving || !accountId
                            ? "Loading…"
                            : short(accountId)}
                    </h1>
                    <p className="text-sm text-muted-foreground truncate">
                        {accountId ?? "Resolving account…"}
                    </p>
                </div>
            </section>

            {(authStatus === "authenticated" || authStatus === "expired") &&
                accountId && <SessionsSection />}
        </main>
    );
}
