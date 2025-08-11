import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './cms/context/AuthContext';
import { LiveStoreProvider } from './context/LiveStoreContext';
import { CurrencyProvider } from './context/CurrencyContext';
import FixedButton from './Components/UI/FixedButton';
import LiveStore from './Components/UI/LiveStore';
// import TestingPanel from './Components/UI/TestingPanel';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Certifurb",
  description: "Your trusted marketplace for certified refurbished products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LiveStoreProvider>
            <CartProvider>
              <FavoritesProvider>
                <CurrencyProvider>
                  {children}
                </CurrencyProvider>
              </FavoritesProvider>
            </CartProvider>
            {/* <FixedButton /> */}
            {/* <LiveStore /> */}
            
          </LiveStoreProvider>
        </AuthProvider>
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68637c6248554319135fc3f9/1iv29rp8l';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
