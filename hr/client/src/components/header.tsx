'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {  MdPerson, MdExitToApp } from 'react-icons/md'; // Example icons from React-Icons
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Loading from './loading';


const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { employeeDetails, loading } = useAuth(); // Destructure employeeDetails and loading

  useEffect(() => {
    const token = localStorage.getItem('accessTokenHr');
    if (!token) {
        console.log("no token");
        router.push('/');
    } 
}, [router]);



  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true);
    const token = localStorage.getItem('accessTokenHr');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/logout`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: {
          'Authorization': `${token}`, // Send token in the Authorization header
        },
      });

      if (response.ok) {
        // Remove token from localStorage
        localStorage.removeItem("accessTokenHr");
        toast.success('Log out successful');

        // Redirect to the login page
        router.push("/");
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      if (error) {
        toast.error('Logout failed');

      }
    } finally {
      setIsLoggingOut(false);
    }
  };
  if (loading) {
    return <div><Loading/></div>; // Show a loading state while the profile is being fetched
  }

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full  transition-all border-b border-gray-200`,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white': selectedLayout,
        },
      )}
    >
      <div className="flex h-[70px] items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN_IMAGE}uploads/${employeeDetails?.logo}`}
            alt="Logo"
              width={50}
              height={50}
            />
          </Link>
          <Link href="/profile">
            <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
              <MdPerson size={20} />
            </div>
          </Link>
         
          <Link href="/access">
            <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
              <MdPerson size={20} />
            </div>
          </Link>

          {/* Logout Button */}
          <button
            className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-center text-white"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <MdExitToApp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
