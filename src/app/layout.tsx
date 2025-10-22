"use client";
import { Outfit } from 'next/font/google';
import './globals.css';
import { Bounce, ToastContainer } from "react-toastify";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session| null;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProvider session={session}> 
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
