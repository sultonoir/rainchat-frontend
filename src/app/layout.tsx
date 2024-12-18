import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Provider from "@/provider/provider";
import { getSession } from "@/server/session";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s • Rainchat",
    default: "Rainchat",
  },
  description: "Quickly send and receive messages directly from your computer.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="dark overflow-hidden">
        <Provider user={user}>{children}</Provider>
      </body>
    </html>
  );
}
