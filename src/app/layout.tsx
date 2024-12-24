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
    template: "%s • Meseji",
    default: "Meseji",
  },
  description: "Quickly send and receive messages directly from your computer.",
  icons: [{ rel: "icon", url: "/logo.png" }],
  metadataBase: new URL("https://meseji.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    title: {
      template: "%s • Meseji",
      default: "Meseji",
    },
    description:
      "Quickly send and receive messages directly from your computer.",
    url: "https://meseji.vercel.app/",
    siteName: "sultonoir-chat",
    images: [
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: {
      template: "%s • Meseji",
      default: "Meseji",
    },
    site: "https://meseji.vercel.app/",
    description:
      "Quickly send and receive messages directly from your computer.",
    images: [
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 800,
        height: 600,
      },
      {
        url: "https://utfs.io/f/lU4D66pu7X2kNRUb0NCYROzoUNZ6d0PeDCctF43rQvykpA1E",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="dark">
        <Provider user={user}>{children}</Provider>
      </body>
    </html>
  );
}
