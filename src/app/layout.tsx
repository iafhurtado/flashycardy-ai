import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FlashyCardy",
  description: "A flashcard application with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{ baseTheme: dark }}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" className="dark">
        <body className={`${poppins.variable} antialiased`}>
          <Navigation />
          <main className="max-w-7xl mx-auto p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}