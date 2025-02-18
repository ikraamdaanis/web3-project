import { Toaster } from "components/ui/sonner";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "providers/theme-provider";
import { WalletProviderWrapper } from "providers/wallet-provider";
import type { ReactNode } from "react";
import "styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "web3 project",
  description: "web3 project "
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="freelio" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProviderWrapper>
            {children}
            <Toaster richColors />
          </WalletProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
