import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center">
        <div className="relative mx-auto w-80 h-40">
          <Image
            src="/no-permission.png" // Image stored in the public folder
            alt="No Permission"
            width={320}
            height={320}
            className="animate-[float_3s_infinite] shadow-xl rounded-lg"
          />
        </div>
        <h1 className="text-5xl font-extrabold text-blue-700 mt-6">No permission to login.<br/> First allocation permission !</h1>
        <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transform transition hover:scale-105 hover:bg-blue-700">
         
            Return Login Page
     
        </Link>
      </div>
    </div>
  );
}
