
export class PeridotWallet {

    getPeridot() {
        if (typeof window === "undefined") return null;
        return (window as any).peridotwallet;
    }

    assertPeridot() {
        if (!getPeridot().master.isPeridotWallet) {
            throw new Error(
                "PeridotWallet extension not detected (window.peridotwallet.master missing)."
            );
        }
    }

    async signMaster() {
        setBusy(true);
        // setError("");
        try {
            assertPeridot();

            const domain = window.location.host;
            const challenge = buildMasterChallenge(domain);

            const msgText = state.message ?? "";
            if (!msgText.trim()) throw new Error("Message cannot be empty.");

            // IMPORTANT: runtime terbaru expect { message: Uint8Array, challenge }
            const res = await getPeridot().master.signMessage(
                toU8Message(msgText),
                challenge
            );

            console.log(res);

            // support new nested results OR legacy flat results
            const signature =
                res?.signature?.data ?? res?.signature ?? res?.signatureBase64;
            const publicKey =
                res?.publicKey?.data ?? res?.publicKey ?? res?.publicKeyBase64;
            const signedMessage =
                res?.signedMessage?.data ?? res?.signedMessage ?? undefined;

            if (!signature) throw new Error("signMessage did not return signature.");

            setState((s) => ({
                ...s,
                signature,
                publicKey: publicKey ?? s.publicKey,
                signedMessage,
            }));
        } catch (e: any) {
            // setError(e?.message ?? "Unknown error");
            console.error(e);
        } finally {
            setBusy(false);
        }
    }
}