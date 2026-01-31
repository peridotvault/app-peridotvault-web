"use client";

import { useEffect, useMemo, useState } from "react";
import {
    MyGameItem,
    LibraryErrorCode,
    getMyGamesForSession,
    isLibraryErrorCode,
    LIBRARY_ERROR_CODES,
} from "@/features/game/services/library.service";
import { useChainStore } from "@/shared/states/chain.store";

type UseMyGamesResult = {
    games: MyGameItem[];
    loading: boolean;
    errorCode: LibraryErrorCode | null;
    errorMessage: string | null;
    isEmpty: boolean;
    reload: () => void;
};

export function useMyGames(): UseMyGamesResult {
    const chain = useChainStore((state) => state.chainKey);

    const [games, setGames] = useState<MyGameItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState<LibraryErrorCode | null>(null);
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                setLoading(true);
                setErrorCode(null);

                const myGames = await getMyGamesForSession();

                if (!mounted) return;
                setGames(myGames);
            } catch (error) {
                if (!mounted) return;

                const message = error instanceof Error ? error.message : "";
                const code = isLibraryErrorCode(message)
                    ? message
                    : LIBRARY_ERROR_CODES.RpcFailed;

                setErrorCode(code);
                setGames([]);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        }

        load();

        return () => {
            mounted = false;
        };
    }, [chain, nonce]);

    const errorMessage = useMemo(() => {
        if (!errorCode) return null;

        switch (errorCode) {
            case LIBRARY_ERROR_CODES.MissingSession:
                return "Please sign in to view your library.";
            case LIBRARY_ERROR_CODES.UnsupportedAccountType:
                return "Your account type is not supported for EVM games.";
            case LIBRARY_ERROR_CODES.UnsupportedChain:
                return "Selected chain does not support this EVM library view.";
            case LIBRARY_ERROR_CODES.InvalidAccount:
                return "Invalid wallet address found in your session.";
            case LIBRARY_ERROR_CODES.RpcFailed:
            default:
                return "Failed to load your library from the chain.";
        }
    }, [errorCode]);

    return {
        games,
        loading,
        errorCode,
        errorMessage,
        isEmpty: !loading && !errorCode && games.length === 0,
        reload: () => setNonce((n) => n + 1),
    };
}
