import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';
import SideNav from '@/components/side-nav';
import Footer from '@/components/footer';
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
      title: "Digirib",
      description: "Edit Design BOQ",
    };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    
        <div className={`bg-white ${inter.className}`}>
              <SideNav />
              <main className="flex-1">
                <MarginWidthWrapper>
                  <Header />
                  <HeaderMobile />
                  <PageWrapper>
                    <Toaster position="top-center" />
                    {children}
                  </PageWrapper>
                  <Footer />
                </MarginWidthWrapper>
              </main>
        </div>
     
  );
}