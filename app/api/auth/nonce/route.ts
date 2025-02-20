import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import crypto from "crypto";
import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import type { Nonce } from "types";

// Note: This is for demonstration purposes only and won't scale in production
export const nonceStore: Record<string, Nonce> = {};

/**
 * @url /api/auth/nonce?walletAddress=${walletAddress}
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("walletAddress");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  // Validate wallet address format, should throw an error if invalid
  // https://github.com/solana-labs/solana-web3.js/blob/maintenance/v1.x/src/publickey.ts#L48
  try {
    new PublicKey(walletAddress);
  } catch {
    return NextResponse.json(
      { error: "Invalid wallet address format" },
      { status: 400 }
    );
  }

  // Generate a random nonce
  const nonce = crypto.randomBytes(32).toString("hex");

  // Store the nonce with a timestamp
  nonceStore[walletAddress] = {
    nonce,
    createdAt: Date.now()
  };

  return NextResponse.json({ nonce });
}

/**
 * I would put this in a different route, but for testing purposes, we're using
 * this route here so we can use the nonce store because variables are stored
 * in memory for each route in Next.js.
 *
 * @url /api/auth/verify
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { walletAddress, signature, nonce } = body;

  if (!walletAddress || !signature || !nonce) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if nonce exists and is valid
  const storedNonce = nonceStore[walletAddress];

  if (!storedNonce) {
    return NextResponse.json(
      { error: "No nonce found for this wallet" },
      { status: 400 }
    );
  }

  if (storedNonce.nonce !== nonce) {
    return NextResponse.json({ error: "Invalid nonce" }, { status: 400 });
  }

  // Check if nonce is expired (3 seconds validity, for testing purposes)
  if (Date.now() - storedNonce.createdAt > 3000) {
    delete nonceStore[walletAddress];
    return NextResponse.json({ error: "Nonce expired" }, { status: 400 });
  }

  try {
    // Convert signature from base58 to Uint8Array
    const signatureUint8 = bs58.decode(signature);

    // Convert message to Uint8Array
    const messageUint8 = new TextEncoder().encode(nonce);

    // Convert public key to Uint8Array
    const publicKeyUint8 = new PublicKey(walletAddress).toBytes();

    // Verify signature
    const isValid = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKeyUint8
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Clean up used nonce
    delete nonceStore[walletAddress];

    return NextResponse.json({
      authenticated: true,
      message: "Successfully authenticated with wallet"
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Verification failed",
        details: (error as Error).message
      },
      { status: 400 }
    );
  }
}
