import { WalletConnect } from "components/wallet-connect";

/**
 * @url `/`
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="h-full min-h-screen bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
          <div className="mx-auto flex min-h-screen max-w-screen-md flex-col items-center px-4 pt-8 sm:pt-16">
            <h1 className="mb-4 text-balance text-center text-3xl font-bold sm:text-4xl md:text-5xl">
              Start your Solana journey right here
            </h1>
            <div className="mb-12 mt-8">
              <WalletConnect />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
