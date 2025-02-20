"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Button } from "components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

/**
 * This component handles wallet authentication by requesting a nonce from the
 * server, signing it with the user's wallet, and verifying the signature.
 */
export const WalletAuth = () => {
  const { publicKey, signMessage } = useWallet();

  const [pending, startTransition] = useTransition();

  async function handleAuthenticate() {
    startTransition(async () => {
      if (!publicKey || !signMessage) {
        toast.error("Wallet not connected or does not support signing");

        return;
      }

      const toastId = toast.loading("Authenticating with wallet...");

      try {
        // 1. Request nonce from server
        toast.loading("Requesting nonce...", {
          id: toastId
        });

        const nonceResponse = await fetch(
          `/api/auth/nonce?walletAddress=${publicKey.toString()}`
        );
        const { nonce } = await nonceResponse.json();

        if (!nonce) {
          throw new Error("Failed to get nonce from server");
        }

        // 2. Sign the nonce with wallet
        toast.loading("Signing nonce...", {
          id: toastId
        });

        const message = new TextEncoder().encode(nonce);
        const signatureBytes = await signMessage(message);
        const signature = bs58.encode(signatureBytes);

        // 3. Send signature back to server for verification
        toast.loading("Verifying signature...", {
          id: toastId
        });

        const verifyResponse = await fetch("/api/auth/nonce", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
            signature,
            nonce
          })
        });

        const verifyResult = await verifyResponse.json();

        if (verifyResult.authenticated) {
          toast.success("Wallet authenticated successfully", {
            id: toastId
          });
        } else {
          throw new Error(verifyResult.error || "Verification failed");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "There was an issue authenticating with your wallet",
          {
            id: toastId
          }
        );
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleAuthenticate}
        disabled={pending}
        size="lg"
        className="rounded bg-[#512da8] px-4 py-2 font-medium text-white transition hover:bg-[#512da8]/80 disabled:opacity-50"
      >
        Request Nonce
      </Button>
      <p className="text-sm text-zinc-400">
        This will request a nonce from the server and sign it with your wallet.
        For testing purposes, if you take more than 3 seconds to sign the nonce,
        it will expire.
      </p>
    </div>
  );
};
