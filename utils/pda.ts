import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "consts";

export function findUserStakePDA(userPubkey: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user_stake"), userPubkey.toBuffer()],
    PROGRAM_ID
  );
}

export function findProgramStatePDA() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    PROGRAM_ID
  );
}

export function findVaultPDA() {
  return PublicKey.findProgramAddressSync([Buffer.from("vault")], PROGRAM_ID);
}
