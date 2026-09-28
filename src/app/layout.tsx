import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import Header from "../components/header";
import Footer from "../components/footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background text-white">
        <Providers>
        <Header/>
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}