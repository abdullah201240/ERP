'use client'
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Project {
  id: number;
  projectType: string;
  projectName: string;
  totalArea: string;
  projectAddress: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  clientEmail: string;
  creatorName: string;
  creatorEmail: string;
  requirementDetails: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  projectDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Ensure the `id` is used correctly or validated
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [daysPassed, setDaysPassed] = useState<number | null>(null);
  useEffect(() => {
    if (!token) {
      router.push('/'); // Redirect to login page if token doesn't exist
    } else {
      const fetchProject = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/project/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          console.log(data.data); // Log the response data


          setProject(data.data || null); // Set the project data
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [router, token, id]);

  useEffect(() => {
    if (project) {
      // Convert string dates to Date objects
      const startDate = new Date(project.startDate); // Ensure valid date conversion
      const endDate = new Date(project.endDate); // Ensure valid date conversion
      const currentDate = new Date(); // Get the current date

      // Calculate days remaining
      const remainingTime = endDate.getTime() - currentDate.getTime();
      setDaysRemaining(Math.max(0, Math.floor(remainingTime / (1000 * 60 * 60 * 24)))); // Ensure non-negative result

      // Calculate days passed
      const passedTime = currentDate.getTime() - startDate.getTime();
      setDaysPassed(Math.max(0, Math.floor(passedTime / (1000 * 60 * 60 * 24)))); // Ensure non-negative result



    }
  }, [project]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }



  return (
    <div className="bg-gray-100  min-h-screen ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Details</h1>

      {/* Project Title Section */}
      <div className="bg-teal-700 flex items-center p-4 rounded-lg mb-8 ">
        <FaArrowLeft className="text-white mr-3 text-2xl cursor-pointer" />
        <h1 className="text-2xl text-white font-semibold">{project.projectName || 'Loading...'}</h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-white p-6 rounded-lg ">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Project Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p><strong className='text-[#4472C4] pr-2'>Project Owner:</strong> {project.clientName || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Supervisor Name:</strong> {project.supervisorName || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Type:</strong>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">

                  {project.projectType || 'N/A'}
                </button>
              </p>
              <p><strong className='text-[#4472C4] pr-2'>Project Timeline:</strong>  {project.projectDeadline || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Name:</strong> {project.projectName || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Days Passed:</strong> {daysPassed || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Details:</strong> Project Details xyz</p>
              <p><strong className='text-[#4472C4] pr-2'>Days Remaining:</strong> {daysRemaining || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Total Built-up Area:</strong> {project.totalArea || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Project Address:</strong> {project.projectAddress || 'N/A'} </p>
              <p><strong className='text-[#4472C4] pr-2'>Client Name:</strong> {project.clientName || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Contact:</strong> {project.clientContact || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Address:</strong> {project.clientAddress || 'N/A'}</p>
              <p><strong className='text-[#4472C4] pr-2'>Client Email:</strong> {project.clientEmail || 'N/A'}</p>
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
                <p className="text-5xl font-extrabold mt-12 mb-12">{daysRemaining || 'N/A'}</p>
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
          <Link href={`/editProjects/${id}`} className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
            <span className="mr-2"><FaEdit /></span>
            <span>Update</span>
          </Link>
        </div>

      </div>

    </div>
  );
}