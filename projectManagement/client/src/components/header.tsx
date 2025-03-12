'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MdPerson, MdExitToApp, MdNotifications } from 'react-icons/md'; // Example icons from React-Icons
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
interface EmployeeDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  companyId: string;
  sisterConcernId: string;
  photo: string;
  employeeId: string;
  logo: string;
}
interface Notification {
  id: number;
  message: string;
  createdAt: string; // Adjust type based on API response
}

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [notifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Define the type for the ref

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log("no token");
      router.push('/');
    }
  }, [router]);

  const fetchCompanyProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.table(data.data);
      if (data.success) {
        setEmployeeDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/');
    } else {
      fetchCompanyProfile();
    }
  }, [router, fetchCompanyProfile]);
  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);


  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true);
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/logout`, {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: {
          'Authorization': `${accessToken}`, // Send token in the Authorization header
        },
      });

      if (response.ok) {
        // Remove token from localStorage
        localStorage.removeItem("accessToken");
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
  const fetchNotifications = async () => {
    setShowNotifications(!showNotifications); // Toggle dropdown
    // try {
    //   const token = localStorage.getItem('accessToken');
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/notifications`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data: { success: boolean; data: Notification[] } = await response.json(); // Typed response

    //   if (data.success) {
    //     setNotifications(data.data);
    //     setShowNotifications(!showNotifications); // Toggle dropdown
    //   }
    // } catch (error) {
    //   console.error('Error fetching notifications:', error);
    //   toast.error('Failed to load notifications');
    // }
  };


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
              src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN}uploads/${employeeDetails?.logo}`}
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

          <div className="relative">
            <button
              className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
              onClick={fetchNotifications}
            >
              <MdNotifications size={20} />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute  mt-2 w-[30vw] max-w-[60vw] bg-white border border-gray-200 shadow-lg rounded-md transform transition-all duration-300 ease-in-out"
              >
                {/* Header with close button */}
                <div className="flex justify-between items-center p-2 text-gray-700 font-semibold border-b">
                  <span>Notifications</span>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1 hover:bg-gray-100 rounded-full focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Notification List */}
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="p-2 border-b text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        {notification.message}
                      </div>
                    ))
                  ) : (
                    // Empty State Design
                    <div className="p-4 flex flex-col items-center justify-center text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400 mb-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">No new notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer (Optional) */}
                <div className="p-2 text-sm text-center text-blue-600 hover:text-blue-700 cursor-pointer border-t">
                  Mark all as read
                </div>
              </div>
            )}
          </div>
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
