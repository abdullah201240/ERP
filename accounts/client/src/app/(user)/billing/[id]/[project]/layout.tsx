import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
      title: "Digirib",
      description: "Digirib",
    };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
   
     
        <div className={`bg-white ${inter.className}`}>
             
              <main className="flex-1">
                
                    
                    {children}
                
              </main>
        </div>
      
    
  );
}