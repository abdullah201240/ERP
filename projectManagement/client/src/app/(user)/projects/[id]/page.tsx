import React from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="bg-gray-100  min-h-screen ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Details</h1>

      {/* Project Title Section */}
      <div className="bg-teal-700 flex items-center p-4 rounded-lg mb-8 ">
        <FaArrowLeft className="text-white mr-3 text-2xl cursor-pointer" />
        <h1 className="text-2xl text-white font-semibold">Project 01</h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-white p-6 rounded-lg ">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Project Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p><strong className='text-[#4472C4] pr-2'>Project Owner:</strong> Md. Faisal</p>
              <p><strong className='text-[#4472C4] pr-2'>Supervisor Name:</strong> Mehedi Hasan</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Type:</strong>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  Premium
                </button>
              </p>
              <p><strong className='text-[#4472C4] pr-2'>Project Timeline:</strong> 30 Days</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Name:</strong> International Club, Dhaka</p>
              <p><strong className='text-[#4472C4] pr-2'>Days Passed:</strong> 20 Days</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Details:</strong> Project Details xyz</p>
              <p><strong className='text-[#4472C4] pr-2'>Days Remaining:</strong> 10 Days</p>
              <p><strong className='text-[#4472C4] pr-2'>Total Built-up Area:</strong> 29,000 sft</p>
              <p><strong className='text-[#4472C4] pr-2'>Current Stage:</strong> Design Development</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Address:</strong> Satarkul, Uttor-Badda, Dhaka-9586</p>
              <p><strong className='text-[#4472C4] pr-2'>Current Work in Progress:</strong> 3D Design Development</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Name:</strong> Nazmul Hoda</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Contact:</strong> +8801770 006782</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Address:</strong> Satarkul, Uttor-Badda</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Email:</strong> nhoda201224@gmail.com</p>
              <p><strong className='text-[#4472C4] pr-2'>Assigned to:</strong> ******</p>
              <div>
                <p><strong className='text-[#4472C4]'>Remaining Tasks:</strong></p>
                <ul className="list-disc pl-6 mt-2">
                  <li>3D Design Development</li>
                  <li>Rendering</li>
                  <li>Working Drawing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Days Remaining Widget */}
          <div className="w-full md:w-1/4">
            <div className='flex flex-col items-center bg-white shadow-xl'>
              <div className="bg-[#9D2933] text-white rounded-lg shadow-lg w-full text-center p-4">
                <h3 className="font-bold text-lg mb-2">DAYS REMAINING</h3>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-5xl font-extrabold mt-12 mb-12">10</p>
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
          <Link href={'/editProjects/1'} className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
            <span className="mr-2"><FaEdit /></span>
            <span>Update</span>
          </Link>
        </div>
        
      </div>

    </div>
  );
}