import type { Connection, PublicKey } from "@solana/web3.js";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "utils/cn";

/** 1 SOL = 1 billion lamports */
const LAMPORTS_PER_SOL = 1_000_000_000;

export const AddSol = ({
  publicKey,
  connection
}: {
  publicKey: PublicKey;
  connection: Connection;
}) => {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  async function getAirdrop() {
    if (!publicKey) return;

    startTransition(async () => {
      const toastId = toast.loading("Requesting airdrop...");

      try {
        const signature = await connection.requestAirdrop(
          publicKey,
          LAMPORTS_PER_SOL
        );

        const latestBlockhash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        });

        toast.success("1 SOL has been airdropped to your wallet", {
          id: toastId
        });

        router.refresh();
      } catch (error) {
        const tooManyAirdropsError =
          error instanceof Error &&
          error.message.includes("your airdrop limit") ? (
            <p>
              You&apos;ve either reached your airdrop limit today or the airdrop
              faucet has run dry. Please visit{" "}
              <a
                href="https://faucet.solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://faucet.solana.com
              </a>{" "}
              for alternate sources of test SOL.
            </p>
          ) : null;

        toast.error(
          error instanceof Error
            ? tooManyAirdropsError || error.message
            : "An unknown error occurred while requesting airdrop",
          { id: toastId }
        );
      }
    });
  }

  return (
    <Button
      onClick={getAirdrop}
      disabled={pending}
      className={cn(
        "rounded-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
        pending && "opacity-50"
      )}
    >
      Get Test SOL ◎
    </Button>
  );
};
