"use client";

import type { Idl } from "@coral-xyz/anchor";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet
} from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "components/ui/form";
import { Input } from "components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "components/ui/select";
import { TOKEN_ID } from "consts";
import stakingIdl from "data/staking-devnet.json";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TimelockBoost, TimelockBoostLabels } from "types";
import { findProgramStatePDA, findUserStakePDA, findVaultPDA } from "utils/pda";
import * as z from "zod";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, {
      message: "Amount is required"
    })
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number"
    }),
  timelockBoost: z.nativeEnum(TimelockBoost)
});

/**
 * Form for a user to stake PGN tokens. The user's tokens are locked in the
 * stake account for a specified period of time. The user can choose between
 * different lock periods, each with a different reward rate.
 */
export function StakeSolForm({ onClose }: { onClose: () => void }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      timelockBoost: TimelockBoost.OneMonth
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey || !anchorWallet) {
      toast.error("Please connect your wallet first");

      return;
    }

    startTransition(async () => {
      const toastId = toast.loading("Processing your staking transaction...");

      try {
        const userAccount = await getAssociatedTokenAddress(
          TOKEN_ID,
          publicKey
        );

        // Check the user's token account balance
        try {
          const balance = await connection.getTokenAccountBalance(userAccount);
          const userBalance = balance.value.uiAmount || 0;
          const stakeAmount = parseFloat(values.amount);

          if (userBalance < stakeAmount) {
            throw new Error(
              `Insufficient balance. You have ${userBalance.toLocaleString()} PGN but are trying to stake ${stakeAmount} PGN`
            );
          }
        } catch (error) {
          if (
            error instanceof Error &&
            !error.message.includes("Insufficient balance")
          ) {
            throw new Error(
              "Failed to check token balance. Make sure you have PGN tokens."
            );
          } else {
            throw error;
          }
        }

        const [programStatePDA] = findProgramStatePDA();
        const [vaultPDA] = findVaultPDA();
        const [userStakePDA] = findUserStakePDA(publicKey);

        const provider = new AnchorProvider(connection, anchorWallet, {
          preflightCommitment: "confirmed"
        });

        const program = new Program(stakingIdl as Idl, provider);

        toast.loading("Waiting for transaction confirmation...", {
          id: toastId
        });

        /**
         * Convert the amount to a BigNumber object.
         * 1 SOL = 1,000,000,000 (1 billion) lamports.
         */
        const amountBigNumber = new BN(parseFloat(values.amount) * 1e9);
        const timelockBoostArg = { [values.timelockBoost]: {} };

        const signature = await program.methods
          .stake(amountBigNumber, timelockBoostArg)
          .accounts({
            user: publicKey,
            userTokenAccount: userAccount,
            vault: vaultPDA,
            userStake: userStakePDA,
            programState: programStatePDA,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID
          })
          .rpc();

        toast.success(
          `Transaction successful! Signature: ${signature.slice(0, 8)}...`,
          { id: toastId }
        );

        onClose();

        form.reset();
      } catch (error) {
        console.error("Transaction failed:", error);

        let errorMessage = "Unknown error";

        if (error instanceof Error) {
          errorMessage = error.message;
          console.error("Error stack:", error.stack);

          if (errorMessage.includes("Unexpected error")) {
            errorMessage =
              "Wallet connection error. Please try again and check wallet approval.";
          }
        }

        toast.error(`Transaction failed: ${errorMessage}`, { id: toastId });
      }
    });
  }

  if (!publicKey) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Enter PGN amount" {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount of PGN tokens you want to stake
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timelockBoost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lock Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lock period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(TimelockBoostLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Longer lock periods provide higher rewards
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Processing..." : "Stake Tokens"}
        </Button>
      </form>
    </Form>
  );
}
