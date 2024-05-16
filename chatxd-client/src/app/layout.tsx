import type { Metadata } from "next";
import "./globals.css";

import { inter, poppins } from "../../public/assets/fonts";
import GlobalContextProvider from "@/context/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "chatXD",
    description: "Real-Time Chat Application",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <GlobalContextProvider>
                    <Header />
                        {children}
                    <Footer />
                </GlobalContextProvider>
            </body>
        </html>
    );
}