import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "DFI ESG Platform",
  description: "Development Finance Institution ESG Risk Evaluation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-gray-50">
        <Navbar />
        <main className="flex-1 overflow-y-auto ml-60">
          <div className="min-h-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
