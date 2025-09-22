
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toolguy - 多功能工具",
  description: "Toolguy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Use Google Fonts via <link> to avoid runtime font download issues */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700&family=Geist+Mono&display=swap"
        />
      </head>
      <body className={`antialiased`}> 
        {children}
      </body>
    </html>
  );
}
