"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";
import { Skeleton } from "components/ui/skeleton";
import { useEffect, useState } from "react";
import { cn } from "utils/cn";

/**
 * Displays the last 3 transactions for a user.
 */
export function RecentTransactions() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const walletLoaded = connected && publicKey;

  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>(
    []
  );

  useEffect(() => {
    if (walletLoaded) {
      connection
        .getSignaturesForAddress(publicKey)
        .then(sigs => {
          // Get last 3 transactions
          setTransactions(sigs.slice(0, 3));
        })
        .finally(() => {
          setTransactionsLoading(false);
        });
    }
  }, [walletLoaded, publicKey, connection]);

  return (
    <>
      <h2 className="text-lg font-medium text-offwhite">Recent Transactions</h2>
      <ul className="flex flex-col gap-2">
        {transactionsLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-col items-start gap-[12.75px] text-sm text-offwhite",
                  index !== 2 && "border-b border-zinc-700 pb-3"
                )}
              >
                <Skeleton className="h-4 w-[240px] bg-zinc-700" />
                <Skeleton className="h-4 w-full bg-zinc-700" />
                <Skeleton className="h-4 w-[120px] bg-zinc-700" />
              </div>
            ))}
          </>
        ) : (
          transactions.map((tx, index) => (
            <li
              key={tx.signature}
              className={cn(
                "flex w-full flex-col items-center gap-2 text-sm text-offwhite",
                index !== transactions.length - 1 &&
                  "border-b border-zinc-700 pb-2"
              )}
            >
              <p className="line-clamp-1 w-full text-ellipsis">
                Block Time:{" "}
                {tx.blockTime
                  ? new Date(tx.blockTime * 1000).toLocaleString()
                  : "N/A"}
              </p>
              <p className="w-full truncate">Signature: {tx.signature}</p>
              <p className="line-clamp-1 w-full text-ellipsis">
                Slot: {tx.slot}
              </p>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
