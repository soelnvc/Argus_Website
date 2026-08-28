import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ProgressiveBlur from "@/components/ProgressiveBlur";
import CurtainTransition from "@/components/CurtainTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Argus AI",
  description: "The hundred-eyed watchman for industrial safety",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CurtainTransition />
        <SmoothScroll>{children}</SmoothScroll>
        <ProgressiveBlur
          position="bottom"
          height="60px"
          className="fixed bottom-0 left-0 right-0 z-50"
        />
      </body>
    </html>
  );
}

