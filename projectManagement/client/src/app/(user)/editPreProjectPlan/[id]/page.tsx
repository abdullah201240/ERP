'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaChevronDown } from 'react-icons/fa';

interface FormData {
  projectName: string;
  ProjectAddress: string;
  clientName: string;
  clientNumber: string;
  visitDateTime: string;
  assignedTo: { eName: string; eid: string; id: string }[]; // Stores selected employees
}

export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id;
  const token = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState<FormData>({
    projectName: '',

    ProjectAddress: '',
    clientName: '',
    clientNumber: '',
    visitDateTime: '',

    assignedTo: [],

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

  const fetchEmployees = async (page: number) => {
    try {
      if (!token) {
        router.push('/');
        return; // Exit the function if there's no token
      }
      if (!employeeDetails) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ADMIN}sisterConcern/employee/${employeeDetails.sisterConcernId}?page=${page}&limit=10`, {
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
  };
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
  }, [isDropdownOpen, currentPage]);

  const handleScroll: React.UIEventHandler<HTMLUListElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight && hasMoreEmployees) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!token) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/pre-site-visit-plan/${pageId}`, {
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
  }, [router, token, pageId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectEmployee = async (employee: { id: string; name: string; }) => {
    try {
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/assignedToPreProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ preSiteVisitPlanId: pageId, eid: employee.id, eName: employee.name }),
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
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/assignedToPreProject/${id}`, {
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
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/pre-site-visit-plan/${pageId}`, {
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
      router.push('/create-pre-project-plan'); // Redirect to the projects page after successful update
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
      <h1 className="text-2xl text-black mb-6">Update Pre Project Plan</h1>
      <div className='bg-[#433878] p-8 rounded-xl'>
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <p className='text-white'>Fill-up all Information and create a update project successfully!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className='text-white mb-2'>Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                disabled
                placeholder="Project Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
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
              <label className='text-white mb-2'>Client Phone</label>
              <input
                type="test"
                id="clientNumber"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleInputChange}
                placeholder="Client Phone"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>
            <div>
              <label className='text-white mb-2'>Visit Date Time</label>
              <input
                type="datetime-local"
                id="visitDateTime"
                name="visitDateTime"
                value={formData.visitDateTime}
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
                value={formData.ProjectAddress}
                onChange={handleInputChange}
                placeholder="Project Address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>









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