"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AddSol } from "components/add-sol";
import { Card, CardContent } from "components/ui/card";
import { Skeleton } from "components/ui/skeleton";
import { useLoaded } from "hooks/use-loaded";
import { useEffect, useState } from "react";
import { cn } from "utils/cn";

export const WalletConnect = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const loaded = useLoaded();
  const walletLoaded = connected && publicKey;

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (loaded && connected && publicKey) {
      setBalanceLoading(true);
      connection
        .getBalance(publicKey)
        .then(bal => {
          setBalance(bal / LAMPORTS_PER_SOL);
        })
        .finally(() => {
          setBalanceLoading(false);
        });
    }
  }, [loaded, connected, publicKey, connection]);

  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>(
    []
  );

  useEffect(() => {
    if (walletLoaded) {
      connection
        .getSignaturesForAddress(publicKey)
        .then(sigs => {
          setTransactions(sigs.slice(0, 5)); // Get last 5 transactions
        })
        .finally(() => {
          setTransactionsLoading(false);
        });
    }
  }, [walletLoaded, publicKey, connection]);

  return (
    <Card className="min-h-[360px] w-[600px] rounded-2xl border-zinc-600 bg-zinc-900">
      <CardContent className="flex h-full flex-col items-center gap-4 p-4">
        {walletLoaded ? (
          <>
            <div className="flex h-full min-h-[140px] w-full items-center gap-4">
              <div className="flex min-h-[140px] w-full flex-col justify-between gap-2 rounded-xl bg-zinc-800 p-4">
                <h2 className="text-lg font-medium text-offwhite">Balance</h2>
                <section className="flex w-full items-end justify-between gap-2 text-2xl font-semibold text-offwhite">
                  {!balanceLoading ? (
                    `${balance} SOL`
                  ) : (
                    <Skeleton className="h-8 w-[80px] bg-zinc-700" />
                  )}
                  <AddSol publicKey={publicKey} connection={connection} />
                </section>
              </div>
              <div className="flex h-full min-h-[140px] w-full flex-col justify-between rounded-xl bg-zinc-800 p-4">
                <h2 className="text-lg font-medium text-offwhite">Wallet</h2>
                <WalletMultiButton
                  style={{
                    width: "100%"
                  }}
                />
              </div>
            </div>
            <div className="flex h-full min-h-[180px] w-full flex-col gap-4 rounded-xl bg-zinc-800 p-4">
              <h2 className="text-lg font-medium text-offwhite">
                Transaction History
              </h2>
              <ul className="flex flex-col gap-2">
                {transactionsLoading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex w-full flex-col items-start gap-2 text-sm text-offwhite"
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
                      <p className="w-full truncate">
                        Signature: {tx.signature}
                      </p>
                      <p className="line-clamp-1 w-full text-ellipsis">
                        Slot: {tx.slot}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[calc(336px)] w-full items-center justify-center rounded-xl bg-zinc-800">
            {loaded ? (
              <WalletMultiButton
                style={{
                  height: "48px",
                  width: "200px",
                  textAlign: "center",
                  transition: "background-color 0.3s ease-in-out"
                }}
              />
            ) : (
              <Skeleton className="h-12 w-[200px] bg-zinc-800" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
