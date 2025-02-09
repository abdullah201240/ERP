'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaChevronDown } from 'react-icons/fa';

interface FormData {
  projectType: string;
  projectName: string;
  description: string;
  totalArea: string;
  projectAddress: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientContact: string;
  estimatedBudget: string;
  projectDeadline: string;
  startDate: string;
  endDate: string;
  assignedTo: { eName: string; eid: string; id: string }[]; // Stores selected employees
  supervisorName: string;
  supervisorEmail: string;
  requirementDetails: string;
  creatorName: string;
  creatorEmail: string;
}

export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id;

  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    projectName: '',
    description: '',
    totalArea: '',
    projectAddress: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientContact: '',
    estimatedBudget: '',
    projectDeadline: '',
    startDate: '',
    endDate: '',
    supervisorName: '',
    supervisorEmail: '',
    assignedTo: [],
    requirementDetails: '',
    creatorName: '',
    creatorEmail: ''
  });
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

}

  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreEmployees, setHasMoreEmployees] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };


  const fetchCompanyProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.table(data.data)
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
      router.push('/'); // Redirect to login page if token doesn't exist
  } else {
      fetchCompanyProfile();
  }
}, [router, fetchCompanyProfile]);

const fetchEmployees = useCallback(async (page: number) => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/');
      return; // Exit the function if there's no token
    }
    if (!employeeDetails) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ADMIN}sisterConcern/employee/${employeeDetails.sisterConcernId}?page=${page}&limit=50`, {
      headers: {
        Authorization: token, // Ensure token is not null
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    const employeeData = await response.json();
    setEmployees((prev) => [...prev, ...employeeData.data.employees]);
    setHasMoreEmployees(employeeData.data.totalEmployees > employees.length);
  } catch (error) {
    console.error(error);
    setError('Failed to load employees');
  }
}, [ router, employees.length, employeeDetails]); // Include employeeDetails in the dependency array
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      fetchEmployees(currentPage);
    }
  }, [isDropdownOpen, currentPage, fetchEmployees]);

  const handleScroll: React.UIEventHandler<HTMLUListElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight && hasMoreEmployees) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/project/${pageId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (!projectResponse.ok) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }
        const projectData = await projectResponse.json();
        setFormData((prev) => ({
          ...prev,
          ...projectData.data,
        }));

        // Map the assigned employees to the formData
        const assignedTo = projectData.data.assigned.map((employee: { eName: string; eid: string; id: string }) => ({
          eName: employee.eName,
          eid: employee.eid,
          id: employee.id
        }));
        setFormData((prev) => ({
          ...prev,
          assignedTo,
        }));

        // Fetch employee list
        await fetchEmployees(currentPage);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [router, pageId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectEmployee = async (employee: { id: string; name: string; }) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/create-assignedTo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ pid: pageId, eid: employee.id, eName: employee.name }),
      });
      if (!response.ok) {
        toast.error('Failed to update project');
      } else {
        toast.success('Project updated successfully!');
        setFormData((prevData) => ({
          ...prevData,
          assignedTo: [...prevData.assignedTo, { eid: String(employee.id), eName: employee.name, id: String(employee.id) }],
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleRemoveEmployee = async (index: number, id: string) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/delete-assigned/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      } else {
        toast.success('Project updated successfully!');
        setFormData((prevData) => ({
          ...prevData,
          assignedTo: prevData.assignedTo.filter((_, i) => i !== index),
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/project/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error('Failed to update project');
        throw new Error('Failed to update project');
      }
      toast.success('Project updated successfully!');
      router.push('/dashboard'); // Redirect to the projects page after successful update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-white mt-2"
              >
                <option value="">Select a project type</option>
                <option value="Low">Low</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="relative">
            <label className='text-white mb-2'>Assigned To</label>
            <div
                onClick={toggleDropdown}
                className="w-full rounded-md border-gray-300 shadow-sm focus-within:border-black focus-within:ring-black focus-within:ring-opacity-50 p-2 bg-gray-100 mt-2 cursor-pointer pr-10 flex flex-wrap gap-2"
              >
                {formData.assignedTo.length > 0 ? (
                  formData.assignedTo.map((assigned, index) => (
                    <span key={index} className="flex items-center bg-[#3d3d3d] text-white px-2 py-1 rounded-md space-x-2">
                      <span>{assigned.eName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent dropdown toggle
                          handleRemoveEmployee(index, assigned.id);
                        }}
                        className="text-white bg-transparent hover:text-gray-300 focus:outline-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Select an employee</span>
                )}
              </div>
              <FaChevronDown className="absolute right-3 top-12 w-4 h-4 text-gray-600" aria-hidden="true" />
              {isDropdownOpen && (
                <div
                  id="assignedTo"
                  className="absolute z-10 w-64 bg-white divide-y divide-gray-100 rounded-lg shadow mt-2"
                  ref={dropdownRef}
                >
                  <ul
                    className="p-3 space-y-3 text-sm text-gray-700"
                    onScroll={handleScroll}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {employees
                      .filter((employee) => !formData.assignedTo.some((assigned) => assigned.eid === employee.id.toString()))
                      .map((employee) => (
                        <li key={employee.id}>
                          <div className="flex items-center">
                            <input
                              id={`checkbox-item-${employee.id}`}
                              type="checkbox"
                              value=""
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              onChange={() => handleSelectEmployee(employee)}
                            />
                            <label
                              htmlFor={`checkbox-item-${employee.id}`}
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              {employee.name}
                            </label>
                          </div>
                        </li>
                      ))}
                    {hasMoreEmployees && <li>Loading more employees...</li>}
                  </ul>
                </div>
              )}
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
                id="clientContact"
                name="clientContact"
                value={formData.clientContact}
                onChange={handleInputChange}
                placeholder="Client Phone"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Client Address</label>
              <input
                type="text"
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                placeholder="Client Address"
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
              <label className='text-white mb-2'>Supervisor Name</label>
              <input
                type="text"
                id="supervisorName"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleInputChange}
                placeholder="Supervisor Name"
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

            <div>
              <label className='text-white mb-2'>Creator Name</label>
              <input
                type="text"
                id="creatorName"
                name="creatorName"
                value={formData.creatorName}
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className='text-white mb-2'>Creator Email</label>
              <input
                type="text"
                id="creatorEmail"
                name="creatorEmail"
                value={formData.creatorEmail}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>
          </div>

          <div>
            <label className='text-white mb-2'>Requirement Details</label>
            <textarea
              id="requirementDetails"
              required
              name="requirementDetails"
              value={formData.requirementDetails}
              onChange={handleInputChange}
              rows={3}
              placeholder="Requirement Details"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
            ></textarea>
          </div>

          <div className="col-span-full mt-6 p-2">
            <button
              type="submit"
              className="block w-full border border-white text-white font-bold py-3 px-4 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}