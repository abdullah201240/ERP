'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from "framer-motion";
import { FaRegClock } from 'react-icons/fa'; // Import clock icon
import Loading from '../../../components/loading'
import { Image } from "@heroui/react";
import NextImage from "next/image";
import { Card, CardHeader, CardBody } from "@heroui/card";

export default function Page() {
  const { employeeDetails, loading } = useAuth(); // Destructure employeeDetails and loading
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // Update the time every second
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer when the component unmounts
  }, []);

  const formattedTime = currentTime.toLocaleString('en-US', {
    weekday: 'short', // Abbreviated weekday (e.g., Mon)
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // 12-hour format with AM/PM
  });

  if (loading) {
    return <div>
      <Loading />
    </div>; // Show a loading state while the profile is being fetched
  }

  if (!employeeDetails) {
    return <div>Unable to load employee details.</div>; // Show if no details were fetched
  }

  return (
    <div>
      <h1 className='text-xl mb-16'>Welcome, {employeeDetails.name}</h1>
      <div className="relative w-full max-w-sm p-5">

        {/* Animated Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white shadow-xl rounded-lg pt-16 pb-8 px-6 text-center relative"
        >
          {/* Profile Image - Box Shape, Positioned Half Inside and Half Outside the Card */}
          <Card className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <Image
              alt={employeeDetails.name}
              as={NextImage}

              className=" shadow-lg"
              src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN_IMAGE}uploads/${employeeDetails.photo}` || "/huda.png"} // Fallback to default image if not available
              width={100}
              height={100}
            />
          </Card>

          {/* Card Content */}
          <div className="text-center mt-4">
            <h2 className="font-semibold text-xl">{employeeDetails.name}</h2>
            <p className="text-sm text-gray-500">{'UI/UX Designer'}</p>
            <p className="text-sm text-gray-700 mt-2">{formattedTime}</p>

            {/* Status Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto"
            >
              <FaRegClock className="mr-2" />
              In
            </motion.button>
          </div>

        </motion.div>

      </div>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">Frontend Radio</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://heroui.com/images/hero-card-complete.jpeg"
            width={270}
          />
        </CardBody>
      </Card>




    </div>
  );
}
