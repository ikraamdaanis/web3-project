import { AuroraBackground } from "components/ui/aurora-background";
import { WalletConnect } from "components/wallet-connect";

/**
 * @url `/`
 */
export default function HomePage() {
  return (
    <AuroraBackground>
      <main className="relative z-50 min-h-screen bg-gradient-to-r px-4 py-8 text-white sm:pt-16">
        <div className="mx-auto max-w-screen-md">
          <WalletConnect />
        </div>
      </main>
    </AuroraBackground>
  );
}
