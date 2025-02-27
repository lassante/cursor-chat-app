import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatly - Real-time Chat App",
  description: "A modern real-time chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
