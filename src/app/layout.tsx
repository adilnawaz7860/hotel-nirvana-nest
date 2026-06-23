import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Hotel Nirvana Nest | Luxury Stay in Gomti Nagar, Lucknow",
    template: "%s | Hotel Nirvana Nest",
  },
  description:
    "Hotel Nirvana Nest is a premium luxury hotel and fine-dining restaurant in Gomti Nagar, Lucknow, offering deluxe rooms, executive suites, and an exquisite culinary experience.",
  keywords: [
    "Hotel Nirvana Nest",
    "luxury hotel Lucknow",
    "Gomti Nagar hotel",
    "best hotel in Lucknow",
    "hotel booking Lucknow",
    "restaurant Gomti Nagar",
  ],
  openGraph: {
    title: "Hotel Nirvana Nest | Luxury Stay in Gomti Nagar, Lucknow",
    description:
      "Experience modern luxury, elegant rooms and fine dining at Hotel Nirvana Nest, Gomti Nagar, Lucknow.",
    type: "website",
    locale: "en_IN",
    siteName: "Hotel Nirvana Nest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Nirvana Nest | Luxury Stay in Gomti Nagar, Lucknow",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <TooltipProvider delay={150}>
              {children}
              <Toaster position="top-center" richColors />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
