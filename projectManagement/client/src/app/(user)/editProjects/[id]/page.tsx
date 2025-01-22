'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface FormData {
  projectType: string;
  projectName: string;
  description: string;
  totalArea: string;
  projectAddress: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  estimatedBudget: string;
  projectDeadline: string;
  startDate: string;
  endDate: string;
  assignedTo: string[];
}
export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const token = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    projectName: '',
    description: '',
    totalArea: '',
    projectAddress: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    estimatedBudget: '',
    projectDeadline: '',
    startDate: '',
    endDate: '',
    assignedTo: [], // Stores selected employees
  });
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkTokenAndFetchProfile = async () => {
      // Check if the access token exists in localStorage

      // If the token does not exist, redirect to the login page
      if (!token) {
        router.push('/'); // Adjust the path to your login page
        return; // Exit the function early
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
          headers: {
            'Authorization': token
          }
        });

        if (!response.ok) {
          router.push('/'); // Adjust the path to your login page
          return; // Exit the function early
        }

        // Handle the response data here if needed
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a notification)
      }
    };

    checkTokenAndFetchProfile();
  }, [router, token]);


  useEffect(() => {

    const fetchInitialData = async () => {
      try {
        if (!token) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/project/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        if (!projectResponse.ok) {
          console.log(projectResponse)
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }
        const projectData = await projectResponse.json();
        setFormData((prev) => ({
          ...prev,
          ...projectData.data,
        }));

        // Fetch employee list
        const employeeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/employee`, {
          headers: {
            Authorization: token,
          },
        });
        if (!employeeResponse.ok) {
          throw new Error('Failed to fetch employees');
        }
        const employeeData = await employeeResponse.json();
        setEmployees(employeeData.data || []);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [router, token, id]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedOptions,
    }));
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      console.log(JSON.stringify(formData))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/project/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      toast.success('Project updated successfully!');
      router.push('/dashboard'); // Redirect to the projects page after successful update
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'An error occurred');

        setError(err.message || 'An error occurred');
      } else {
        toast.error('An unknown error occurred');

        setError('An unknown error occurred');
      }
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl mb-16">
      <h1 className="text-2xl text-black mb-6">Update Project</h1>
      <div className='bg-[#433878] p-8 rounded-xl'>
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <p className='text-white'>Fill-up all Information and create a update project successfully!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className='text-white mb-2'>Project Type</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              >
                <option value="">Select a project type</option>
                <option value="Low">Low</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div>
              <label className='text-white mb-2'>Assigned To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                multiple
                value={formData.assignedTo}
                onChange={handleEmployeeSelection}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='text-white mb-2'>Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Project Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Client Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Client Email</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                placeholder="Client Email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Client Phone</label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                placeholder="Client Phone"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Project Address</label>
              <input
                type="text"
                id="projectAddress"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleInputChange}
                placeholder="Project Address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Total Area</label>
              <input
                type="text"
                id="totalArea"
                name="totalArea"
                value={formData.totalArea}
                onChange={handleInputChange}
                placeholder="Total Area"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Estimated Budget</label>
              <input
                type="number"
                id="estimatedBudget"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleInputChange}
                placeholder="Estimated Budget"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Project Deadline</label>
              <input
                type="date"
                id="projectDeadline"
                name="projectDeadline"
                value={formData.projectDeadline}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>
          </div>

          <div className="col-span-full mt-6 p-2">
            <button
              type="submit"
              className="block w-full border border-white text-white font-bold py-3 px-4 rounded-full"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
