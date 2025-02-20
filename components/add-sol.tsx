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
    <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
      <span className="relative inline-block overflow-hidden rounded-sm p-[1.5px]">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-sm bg-white text-xs font-medium backdrop-blur-3xl dark:bg-gray-950">
          <Button
            onClick={getAirdrop}
            disabled={pending}
            className={cn(
              "group inline-flex h-[unset] w-full items-center justify-center rounded-sm border-[1px] border-input bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent px-4 py-2 text-center text-gray-900 transition-all hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 dark:text-white dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 sm:w-auto",
              pending && "opacity-50"
            )}
          >
            Get Test SOL ◎
          </Button>
        </div>
      </span>
    </div>
  );
};
