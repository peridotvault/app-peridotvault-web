"use client";

import { useCallback, useEffect, useState } from "react";
import { ButtonWithSound } from "@/shared/components/ui/atoms/ButtonWithSound";
import { Stepper, Step } from "@/shared/components/ui/molecules/Stepper";
import { toastService } from "@/core/ui-system/toast/toast.service";
import { useModal } from "@/core/ui-system/modal/modal.store";
import { getFiatQuoteApi } from "@/core/api/fiat.api";
import type { FiatQuote } from "@/core/api/fiat.api.type";
import { isFiatBlocked } from "@/core/api/fiat.api.type";
import { FiatCheckoutService } from "../services/fiat-checkout.service";
import { authRepo } from "@/core/db/repositories/auth.repo";
import { hasPurchasedGameApi } from "@/core/api/purchase.api";

function formatIdr(minorUnits: string): string {
  const n = Number(minorUnits);
  if (!Number.isFinite(n)) return `${minorUnits} IDR`;
  return `Rp${Math.round(n).toLocaleString("id-ID")}`;
}

export function FiatCheckoutPanel({
  modalId,
  gameId,
  gameName,
  peridotAppClientId,
}: {
  modalId: string;
  gameId: string;
  gameName: string;
  peridotAppClientId?: string;
}) {
  const [quote, setQuote] = useState<FiatQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { label: "Fee quote", status: "pending" },
    { label: "Secure checkout", status: "pending" },
    { label: "Confirm payment", status: "pending" },
  ]);

  const loadQuote = useCallback(async () => {
    setIsLoadingQuote(true);
    setQuoteError(null);
    try {
      const response = await getFiatQuoteApi({ gameId, payment_mode: "fiat" });
      const payload = (response as unknown as { data?: FiatQuote }).data
        ?? (response as unknown as FiatQuote);
      setQuote(payload);
      setSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: "completed" } : s)),
      );
      if (payload.paymentMethods?.length === 1) {
        setSelectedMethod(payload.paymentMethods[0]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load quote";
      setQuoteError(message);
      setSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: "error", description: message } : s)),
      );
    } finally {
      setIsLoadingQuote(false);
    }
  }, [gameId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadQuote();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadQuote]);

  const { blocked, reason } = isFiatBlocked(quote);

  const handleCheckout = async () => {
    if (isProcessing || !quote || blocked) return;

    const session = await authRepo.getSession();
    if (!session) {
      toastService.error("Login Required", {
        desc: "Please log in before purchasing this game.",
      });
      return;
    }

    const alreadyPurchased = await hasPurchasedGameApi(gameId).catch(() => false);
    if (alreadyPurchased) {
      toastService.success("Already Purchased", {
        desc: "You already own this game. Find it in your Library.",
      });
      useModal.getState().close(modalId);
      return;
    }

    setIsProcessing(true);
    const id = toastService.loading("Starting fiat checkout...");
    try {
      setSteps((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: "active" } : s)),
      );
      await FiatCheckoutService.startCheckout(
        {
          gameId,
          netAmountIdr: quote.amountIdr,
          paymentMethod: selectedMethod,
          peridotAppClientId,
        },
        (step, message) => {
          if (step === "redirecting") {
            setSteps((prev) =>
              prev.map((s, i) =>
                i === 1 ? { ...s, status: "completed" } : s,
              ),
            );
            toastService.success("Redirecting to checkout", { id, desc: message });
          }
        },
      );
      // Browser navigates away to DOKU; no further client work on this path.
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed";
      setSteps((prev) =>
        prev.map((s) => (s.status === "active" ? { ...s, status: "error", description: message } : s)),
      );
      toastService.error("Checkout failed", { id, desc: message });
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-110 max-w-full flex flex-col gap-4 p-4">
      <div className="pl-2 pt-2">
        <h2 className="text-lg font-semibold">Pay with fiat — {gameName}</h2>
        <p className="text-sm text-muted-foreground">
          Secure checkout (IDR). You leave this page to pay, then return for confirmation.
        </p>
      </div>

      <div className="rounded-xl bg-card border border-border p-4">
        <Stepper steps={steps} />
      </div>

      {isLoadingQuote && (
        <p className="text-sm text-muted-foreground" role="status">Loading fee quote…</p>
      )}

      {!isLoadingQuote && quoteError && (
        <div className="rounded-xl border border-destructive/40 p-4" role="alert">
          <p className="text-sm font-medium text-destructive">Quote failed</p>
          <p className="text-sm text-muted-foreground">{quoteError}</p>
          <ButtonWithSound
            onClick={() => void loadQuote()}
            className="mt-3 cursor-pointer rounded-lg bg-foreground/10 px-3 py-2 text-sm"
          >
            Retry quote
          </ButtonWithSound>
        </div>
      )}

      {!isLoadingQuote && !quoteError && quote && (
        <>
          <dl className="rounded-xl border border-border divide-y divide-border">
            <div className="flex justify-between px-4 py-2 text-sm">
              <dt className="text-muted-foreground">Game price (net)</dt>
              <dd className="font-medium">{formatIdr(quote.amountIdr)} {quote.currency}</dd>
            </div>
            <div className="flex justify-between px-4 py-2 text-sm">
              <dt className="text-muted-foreground">Transfer fee</dt>
              <dd className="font-medium">{formatIdr(quote.transferFeeIdr)} {quote.currency}</dd>
            </div>
            <div className="flex justify-between px-4 py-2 text-sm">
              <dt className="text-muted-foreground">App fee</dt>
              <dd className="font-medium">{formatIdr(quote.appFeeIdr)} {quote.currency}</dd>
            </div>
            <div className="flex justify-between px-4 py-2 text-sm font-semibold">
              <dt>Total charged</dt>
              <dd>{formatIdr(quote.totalIdr)} {quote.currency}</dd>
            </div>
          </dl>

          {quote.paymentMethods.length > 0 ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="fiat-payment-method" className="text-sm text-muted-foreground">
                Payment method
              </label>
              <select
                id="fiat-payment-method"
                value={selectedMethod ?? ""}
                onChange={(e) => setSelectedMethod(e.target.value || undefined)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a payment method</option>
                {quote.paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/40 p-4" role="alert">
              <p className="text-sm font-medium">Checkout unavailable</p>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
          )}

          <ButtonWithSound
            onClick={() => void handleCheckout()}
            disabled={isProcessing || blocked || !selectedMethod}
            className="w-full cursor-pointer rounded-xl bg-highlight px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? "Starting checkout…" : `Pay ${quote ? formatIdr(quote.totalIdr) : ""}`}
          </ButtonWithSound>
        </>
      )}
    </div>
  );
}
