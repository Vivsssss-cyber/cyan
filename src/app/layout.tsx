import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "../context/GameContext";

export const metadata: Metadata = {
  title: "Startup Valley",
  description: "Startup Valley simulation rebuilt on Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
