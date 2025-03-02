"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AddSol } from "components/add-sol";
import { RecentTransactions } from "components/recent-transactions";
import { StakePngModal } from "components/stake-png-modal";
import { Card, CardContent } from "components/ui/card";
import { Skeleton } from "components/ui/skeleton";
import { WalletAuth } from "components/wallet-auth";
import { useLoaded } from "hooks/use-loaded";
import { useEffect, useState } from "react";

export const WalletConnect = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const loaded = useLoaded();
  const walletLoaded = connected && publicKey;

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (loaded && connected && publicKey) {
        setBalanceLoading(true);

        try {
          const balance = await connection.getBalance(publicKey);

          setBalance(balance / LAMPORTS_PER_SOL);
        } finally {
          setBalanceLoading(false);
        }
      }
    }

    fetchBalance();
  }, [loaded, connected, publicKey, connection]);

  return (
    <Card className="mx-auto min-h-[360px] w-[600px] max-w-full rounded-2xl border-zinc-700 bg-zinc-900">
      <CardContent className="flex h-full flex-col items-center gap-4 p-4">
        {walletLoaded ? (
          <>
            <div className="flex h-full min-h-[140px] w-full flex-col items-center gap-4 sm:flex-row">
              <div className="flex min-h-[140px] w-full flex-col justify-between gap-2 rounded-xl bg-zinc-800 p-4">
                <h2 className="text-lg font-medium text-offwhite">Balance</h2>
                <section className="flex w-full items-end justify-between gap-2 text-2xl font-semibold text-offwhite">
                  {!balanceLoading ? (
                    `${balance} SOL`
                  ) : (
                    <Skeleton className="h-8 w-[80px] bg-zinc-700" />
                  )}
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
            <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-zinc-800 p-4">
              <AddSol publicKey={publicKey} connection={connection} />
            </div>
            <div className="flex h-full min-h-[180px] w-full flex-col gap-4 rounded-xl bg-zinc-800 p-4">
              <RecentTransactions />
            </div>
            <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-zinc-800 p-4">
              <WalletAuth />
            </div>
            <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-zinc-800 p-4">
              <StakePngModal />
              <p className="text-sm text-zinc-400">
                Staking tokens will lock your PNG tokens for a period of time.
                You will not be able to unstake your PNG tokens until the lock
                period is over.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[calc(336px)] w-full items-center justify-center gap-6 rounded-xl bg-zinc-800">
            <div className="flex h-12 min-w-[152px] items-center justify-center rounded-md bg-[#512da8]">
              {loaded ? (
                <section>
                  <WalletMultiButton
                    style={{
                      height: "48px",
                      textAlign: "center",
                      transition: "background-color 0.3s ease-in-out"
                    }}
                  />
                </section>
              ) : (
                <Skeleton className="h-12 w-[152px] bg-zinc-700" />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
