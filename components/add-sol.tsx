import type { Connection, PublicKey } from "@solana/web3.js";
import { Button } from "components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LAMPORTS_PER_SOL = 1000000000;

export const AddSol = ({
  publicKey,
  connection
}: {
  publicKey: PublicKey;
  connection: Connection;
}) => {
  const router = useRouter();

  const getAirdrop = async () => {
    if (!publicKey) return;

    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL // 1 SOL = 1 billion lamports
      );

      await connection.confirmTransaction(signature);

      // Refresh balance

      toast.success("1 SOL has been airdropped to your wallet");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while requesting airdrop"
      );
    }
  };

  // Add this button where you want it to appear:
  return (
    <Button
      onClick={getAirdrop}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
    >
      Get Test SOL
    </Button>
  );
};
