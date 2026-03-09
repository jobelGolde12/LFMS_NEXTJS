import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lost and Found Management System",
  description: "Report and find lost items on campus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-50 dark:bg-black">
        {children}
      </body>
    </html>
  );
}
