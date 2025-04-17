import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { LoadingProvider, WalletProvider } from "./lib/context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
