import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="bottom-0 left-0 right-0 py-2 z-50 bg-[#F1F2F3] md:pl-32">
      <h1 className="text-gray-600 flex flex-col md:flex-row justify-center items-center md:mb-4 md:mt-4 text-sm md:text-base">
        © Copyright IQ Architects Ltd. All Rights Reserved | Developed By
        <Link 
          href="https://digirib.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="pl-2 text-orange-600 font-bold"
        >
          DIGIRIB
        </Link>
      </h1>
    </div>
  );
}