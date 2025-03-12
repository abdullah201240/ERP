'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from "framer-motion";
import { FaRegClock, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import Loading from '../../../components/loading';
import { Button } from "@heroui/react";
import NextImage from "next/image";
import { Card, CardBody } from "@heroui/card";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from '@/components/Calender';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Page() {
  const { employeeDetails, loading } = useAuth(); // Destructure employeeDetails and loading
  const [currentTime, setCurrentTime] = useState(new Date());
  const leaveData = {
    casualLeave: 3,
    sickLeave: 2,
    unpaidLeave: 3,
    maternityLeave: 3,
    totalLeave: 10, // The total available leaves
  };

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
    return <div className="flex justify-center items-center h-screen">
      <Loading />
    </div>; // Show a loading state while the profile is being fetched
  }

  if (!employeeDetails) {
    return <div className="text-center py-16">Unable to load employee details.</div>; // Show if no details were fetched
  }

  // Doughnut chart data
  const chartData = {
    labels: ['Casual', 'Sick', 'Unpaid', 'Maternity'],
    datasets: [{
      data: [
        leaveData.casualLeave,
        leaveData.sickLeave,
        leaveData.unpaidLeave,
        leaveData.maternityLeave,
      ],
      backgroundColor: ['#FF9900', '#C1000C', '#393939', '#2FA52F'], // Using specified colors
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,  // TypeScript type assertion to ensure it matches one of the allowed values
      },
    },
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start with a lower opacity and position
        animate={{ opacity: 1, y: 0 }} // Fade in and move to normal position
        transition={{ duration: 0.8, ease: "easeOut" }} // Slow fade-in and smooth transition
      >
        <h1 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-16 text-left'>Welcome, {employeeDetails.name}</h1>

        {/* Grid container to display cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* First Animated Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-xl rounded-lg pt-16 text-center relative w-full"
          >
            {/* Profile Image - Box Shape, Positioned Half Inside and Half Outside the Card */}
            <Card className="absolute -top-12 left-1/2 transform -translate-x-1/2 ">
            <NextImage
             alt={employeeDetails.name}
             src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN_IMAGE}uploads/${employeeDetails.photo}` || "/huda.png"} // Fallback to default image if not available
             className=' border-2 border-[#2A5158] '
             width={80}
             height={80}
            />

             
            </Card>

            {/* Card Content */}
            <div className="text-center mt-4 mb-4">
              <h2 className="font-semibold text-xl">{employeeDetails.name}</h2>
              <p className="text-sm text-gray-500">UI/UX Designer</p>
              <p className="text-sm text-gray-700 mt-2 mb-12">{formattedTime}</p>

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

          {/* Second Card */}
          <Card className="bg-white shadow-xl rounded-lg text-center relative border-l-4 border-l-[#9747FF] w-full">
            <CardBody className="overflow-visible py-4 px-6 space-y-3">
              <div className="flex justify-between w-full mb-1">
                <p className="text-sm uppercase font-semibold text-black">Last Day</p>
                <small className="text-sm text-gray-600">6 Feb 2025</small>
              </div>
              <div className="flex items-center justify-between bg-[#F2F2F2] p-4 rounded-lg shadow-sm">
                <p className="text-base font-medium text-[#2FA52F]">In Time:</p>
                <p className="text-base font-medium text-[#2FA52F] flex items-center">
                  <FaRegClock className="mr-2 text-[#2FA52F]" /> 09:32:10 AM
                </p>
              </div>

              <div className="flex items-center justify-between bg-[#FFEFF0] p-4 rounded-lg shadow-sm">
                <p className="text-base font-medium text-[#C1000C]">Out Time:</p>
                <p className="text-base font-medium text-[#C1000C] flex items-center">
                  <FaRegClock className="mr-2 text-[#C1000C]" /> 09:32:10 AM
                </p>
              </div>
              <div className="flex items-center justify-center pt-4 w-full">
                <Button className="text-sm bg-white text-[#7D7D7D] border border-[#2FA52F] hover:bg-transparent hover:text-[#2FA52F] transition-all duration-300" color="secondary" size="md">
                  Attendance Report
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Third Card */}
          <div className="space-y-3 w-full">
            <Card className="bg-white shadow-xl rounded-lg text-center relative border-l-4 border-l-[#9747FF]">
              <CardBody className="overflow-visible py-4 px-6 space-y-3">
                <FaRegClock className="text-[#2FA52F] text-xl" />
                <p className="text-base font-medium text-[#828282]">Average check-in</p>
                <p className="text-base font-medium text-[#2FA52F]">09:32:10 AM</p>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-xl rounded-lg text-center relative border-l-4 border-l-[#9747FF]">
              <CardBody className="overflow-visible py-4 px-6 space-y-3">
                <FaSignOutAlt className="text-[#C1000C] text-xl" />  {/* Logout icon */}
                <p className="text-base font-medium text-[#828282]">Average check-out</p>
                <p className="text-base font-medium text-[#C1000C]">08:10 AM</p>
              </CardBody>
            </Card>
          </div>

          {/* Fourth Card */}
          <Card className="bg-white shadow-xl rounded-lg text-center relative border-l-4 border-l-[#9747FF] w-full mb-4">
            <CardBody className="overflow-visible space-y-3">
              <p className="text-lg font-semibold text-black">Leave Balance</p>
              <div className='flex flex-col sm:flex-row items-center justify-between'>
                <div>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li className="text-base font-medium" style={{ color: '#FF9900' }}>3/10 Casual Leave</li>
                    <li className="text-base font-medium pt-2" style={{ color: '#C1000C' }}>2/10 Sick Leave</li>
                    <li className="text-base font-medium pt-2" style={{ color: '#393939' }}>3/10 Unpaid Leave</li>
                    <li className="text-base font-medium pt-2" style={{ color: '#2FA52F' }}>3/120 Maternity Leave</li>
                  </ul>
                </div>
                <div className="flex max-w-[170px] mb-4">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>


      <Calendar/>
    </div>
  );
}