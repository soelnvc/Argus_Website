import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ProgressiveBlur from "@/components/ProgressiveBlur";
import CurtainTransition from "@/components/CurtainTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Argus AI",
  description: "The hundred-eyed watchman for industrial safety",
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

