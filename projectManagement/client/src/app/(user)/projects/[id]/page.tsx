'use client'
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
  estimatedBudget: string;
  assigned: { eName: string; eid: string; id: string }[]; // Stores selected employees
  design?: { stepName: string; stepType: string; startDate: string; endDate: string; completed: string; id: string; }[];
}
interface EmployeeDetails {
  id: string;
  name: string;
  email: string;

  phone: string;

  dob: string;

  gender: string;

  companyId: string;

  sisterConcernId: string;

  photo: string;

  employeeId: string;

}
interface Access {
  id: number;
  employee_id: number;
  permission_id: number;
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
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [daysPassed, setDaysPassed] = useState<number | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [accessData, setAccessData] = useState<Access[]>([]);

  const fetchCompanyProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/'); // Redirect to login page if token doesn't exist
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setEmployeeDetails(data.data);
      }
      if (!response.ok) {
        toast.error('No permission to login. First allocation permission !');

        router.push('/');
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [router])


  const fetchAccess = useCallback(async () => {
    try {
        if (!employeeDetails) {
            return
        }
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/');
            return;
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_ADMIN}access/view-all/${employeeDetails?.id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json(); // Extract JSON data
        setAccessData(data.data || []); // Store API response in state

    } catch (error) {
        console.error('Error fetching access:', error);
    }
}, [router, employeeDetails]);
  useEffect(() => {
    fetchCompanyProfile()

  }, [fetchCompanyProfile]);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
    } else {
        fetchAccess();

    }
}, [router, fetchAccess]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

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


          setProject(data.data || null); // Set the project data
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [router, id]);


  useEffect(() => {
    fetchCompanyProfile()
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
  }, [project, fetchCompanyProfile]);

  const okay = (design: { stepName: string; stepType: string; completed: string }[]): [string, string] => {
    if (!design || design.length === 0) return ['N/A', 'N/A'];

    // Get unique step types that are not fully completed
    const remainingTasks = [...new Set(
      design.filter(step => step.completed !== '100').map(step => step.stepType)
    )].join(', ');

    // If all tasks are complete, return appropriate message
    return remainingTasks ? ['', remainingTasks] : ['All Stages Complete', ''];
  };




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
    <div className="bg-gray-100  min-h-screen mt-2 ">
      <h1 className="text-2xl text-black mb-6">Project Details</h1>


      {/* Project Title Section */}
      <div className="bg-teal-700 flex items-center p-4 rounded-lg mb-8 ">
        <Link href="/dashboard"> <FaArrowLeft className="text-white mr-3 text-2xl cursor-pointer" /></Link>
        <h1 className="text-2xl text-white ">{project.projectName || 'Loading...'}</h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-white p-6 rounded-lg ">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Project Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p><strong className='text-[#4472C4] pr-2'>Project Owner:</strong> {project.creatorName || 'N/A'}</p>
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
              <p><strong className='text-[#4472C4] pr-2'>Requirements:</strong> {project.requirementDetails}</p>
              <p><strong className='text-[#4472C4] pr-2'>Estimated Budget:</strong> {project.estimatedBudget}</p>

              <p><strong className='text-[#4472C4] pr-2'>Assigned to:</strong> {project.assigned && project.assigned.length > 0 ? project.assigned.map(a => a.eName).join(', ') : 'N/A'} </p>
              <div>
                <p><strong className='text-[#4472C4]'>Remaining Tasks:</strong></p>

                <ul className="list-disc pl-6 mt-2">
                  {project.design
                    ? okay(project.design)[1].split(', ').map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                    : <li>N/A</li>
                  }

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

        {accessData.some(access => access.permission_id === 1) && (
          <div className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
          <Link href={`/editProjects/${id}`} className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
            <span className="mr-2"><FaEdit /></span>
            <span>Update</span>
          </Link>
        </div>
      
      
      )}


        

      </div>

    </div>
  );
}