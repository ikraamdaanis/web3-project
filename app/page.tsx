import { WalletConnect } from "components/wallet-connect";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="h-full min-h-screen bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
          <div className="mx-auto flex min-h-screen max-w-screen-md flex-col items-center px-4 pt-12 sm:pt-24">
            <h1 className="mb-4 text-balance text-center text-4xl font-bold sm:text-5xl md:text-6xl">
              Start your Solana journey right here
            </h1>
            <p className="mb-8 text-xl">
              Connect your wallet and explore the world of Solana
            </p>
            <div className="h-[224px]">
              <WalletConnect />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
