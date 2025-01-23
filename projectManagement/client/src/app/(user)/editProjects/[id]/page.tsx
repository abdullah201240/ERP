'use client'
import { useEffect, useRef, useState } from 'react';
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
  assignedTo: { eName: string; eid: string ;id: string }[]; // Stores selected employees
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
    clientContact: '',
    estimatedBudget: '',
    projectDeadline: '',
    startDate: '',
    endDate: '',
    supervisorName: '',
    supervisorEmail: '',
    assignedTo: [], // Stores selected employees
    requirementDetails: '',
    creatorName: '',
    creatorEmail: ''
  });
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Create a ref for the dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
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

    const fetchInitialData = async () => {
      try {
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
          console.log(projectResponse)
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
          ...projectData.data,
          assignedTo, // Set the assignedTo field with the mapped data
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
  }, [router, token, pageId]);


  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    /**
 * Updates the previous data object by adding or updating a property.
 *
 * @param {Object} prevData - The previous state or data object.
 * @param {string} name - The name of the property to be updated or added.
 * @param {any} value - The new value to be assigned to the property.
 * @returns {Object} The updated data object with the new or modified property.
 */
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle employee selection
  // Handle employee selection
  const handleSelectEmployee = async (employee: { id: string; name: string; }) => {


    try {
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
      }
      else{
        toast.success('Project updated successfully!');

        // If the employee was successfully added, update the formData
        setFormData((prevData) => ({
          ...prevData,
          assignedTo: [...prevData.assignedTo, { eid: String(employee.id), eName: employee.name,id:String(employee.id) }],
        }));

      }

     

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


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
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
      if (err instanceof Error) {
        toast.error(err.message || 'An error occurred');

        setError(err.message || 'An error occurred');
      } else {
        toast.error('An unknown error occurred');

        setError('An unknown error occurred');
      }
    }
  };
  const handleRemoveEmployee = async (index: number ,id: string) => {

    try {
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
      }
      else{
        toast.success('Project updated successfully!');
        setFormData((prevData) => {
          return {
            ...prevData,
            assignedTo: prevData.assignedTo.filter((_, i) => i !== index), // Remove employee at the specified index
          };
        });

      }

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

  // The rest of your code remains unchanged


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


            <div style={{ position: 'relative', zIndex: 10 }}>
              <label className='text-white mb-2'>Project Type</label>
              <select
                id="projectType"
                name="projectType"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-white mt-2"
              >
                <option value="" style={{ backgroundColor: 'white' }}>Select a project type</option>
                <option value="Low">Low</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div >
              <div className="relative" > {/* Attach ref here */}
                <label className='text-white mb-2'>Assigned To</label>

                <div
                  onClick={toggleDropdown}
                  className=" w-full rounded-md border-gray-300 shadow-sm focus-within:border-black focus-within:ring-black focus-within:ring-opacity-50 p-2 bg-gray-100 mt-2 cursor-pointer pr-10 flex flex-wrap gap-2"
                >
                  {formData.assignedTo.length > 0 ? (
                    formData.assignedTo.map((assigned, index) => (
                      <span
                        key={index}
                        className="flex items-center bg-[#3d3d3d] text-white px-2 py-1 rounded-md space-x-2"
                      >
                        <span>{assigned.eName}</span>
                        

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent dropdown toggle
                            handleRemoveEmployee(index,assigned.id);
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
              </div>



              {/* Dropdown */}
              {isDropdownOpen && (
                <div
                  id="assignedTo"
                  className="absolute z-10 w-64 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 mt-2"
                  ref={dropdownRef}
                >
                  <ul
                    className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownCheckboxButton"
                  >
                    {employees
                      .filter((employee) => !formData.assignedTo.some((assigned) => assigned.eid === employee.id.toString())) // Ensure both are strings
                      .map((employee) => (
                        <li key={employee.id}>
                          <div className="flex items-center">
                            <input
                              id={`checkbox-item-${employee.id}`} // Unique id for each checkbox
                              type="checkbox"
                              value=""
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                              onChange={() => handleSelectEmployee(employee)} // Call function to add the employee to assignedTo
                            />
                            <label
                              htmlFor={`checkbox-item-${employee.id}`} // Unique htmlFor for each label
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {employee.name} {/* Display employee name */}
                            </label>
                          </div>
                        </li>
                      ))}
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
                placeholder="Client Email"
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
      </div >
    </div >
  );
}
