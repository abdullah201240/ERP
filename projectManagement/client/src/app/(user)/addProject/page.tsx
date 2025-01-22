'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';


/**
 * Page component for adding a new project.
 * This component handles user input, form submission, and user authentication.
 */
export default function Page() {

  const router = useRouter();
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [user, setUser] = useState({ name: '', email: '', id: '' });
  const [formData, setFormData] = useState({
    projectType: '',
    projectName: '',
    totalArea: '',
    clientName: '',
    projectAddress: '',
    clientAddress: '',
    clientContact: '',
    clientEmail: '',
    requirementDetails: '',
  });
  
 
  
/**
 * Function to check for an access token in localStorage and fetch user profile data.
 * If the token does not exist, the user is redirected to the login page.
 * If the token exists, a fetch request is made to retrieve the user's profile data.
 */  useEffect(() => {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem('accessToken');
    // Check if the token exists
    if (!token) {
      router.push('/'); // Redirect to login page if token doesn't exist
    } else {
      // Fetch user profile data from the API
       fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
        headers: {
          'Authorization': token
        }
      })
        /**
   * Processes the response from a fetch request by converting it to JSON format.
   *
   * @param {Response} res - The response object from a fetch request.
   * @returns {Promise<any>} A promise that resolves to the JSON data extracted from the response.
   */
        .then(res => res.json())
        .then(data => {
          if (data) {
            setCreatorName(data.data.name);
            setCreatorEmail(data.data.email);
            
            setUser({ name: data.data.name, email: data.data.email, id: data.data.id });

            
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          router.push('/'); // Redirect to login page in case of any error
        });
    }
  }, [router]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading to true

    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/create-project`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            creatorName,
            creatorEmail
          })
        });

        if (response.ok) {
          await response.json();
          toast.success('Project added successfully!');
          

          setFormData({ // Clear form fields
            projectType: '',
            projectName: '',
            totalArea: '',
            clientName: '',
            projectAddress: '',
            clientAddress: '',
            clientContact: '',
            clientEmail: '',
            requirementDetails: '',
          });




          router.push('/dashboard');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to add project.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      router.push('/'); // Redirect to login if token is not available
    }
  };

  return (
    <div>
      <div className="container mx-auto max-w-6xl mb-12">
        <h1 className="text-2xl text-black mb-6">Add a Project</h1>
        <div className='bg-[#433878] p-8 rounded-xl'>
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <p className='text-white'>Fill-up all Information and create a new project successfully!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Project Type</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                >
                  <option value="">Select a project type</option>
                  <option value="Low">Low</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className='text-white mb-2'>Project Name</label>
                <input
                  type="text"
                  required
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Project Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Total Built-up Area (sft)</label>
                <input
                  type="number"
                  required
                  id="totalArea"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleChange}
                  placeholder="Total Built-up Area"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Client Name</label>
                <input
                  type="text"
                  required
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Project Address</label>
                <input
                  type="text"
                  required
                  id="projectAddress"
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleChange}
                  placeholder="Project Address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Client Address</label>
                <input
                  type="text"
                  required
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  placeholder="Client Address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Client Contact</label>
                <input
                  type="text"
                  required
                  id="clientContact"
                  name="clientContact"
                  value={formData.clientContact}
                  onChange={handleChange}
                  placeholder="Client Contact"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Client Email</label>
                <input
                  type="email"
                  required
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="Client Email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Creator Name </label>
                <input
                  type="text"
                  required
                  id="creatorName"
                  name="creatorName"
                  value={creatorName}
                  disabled
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Creator Email</label>
                <input
                  type="email"
                  required
                  id="creatorEmail"
                  name="creatorEmail"
                  value={user.email}
                  disabled
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
                onChange={handleChange}
                rows={3}
                placeholder="Requirement Details"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              ></textarea>
            </div>

            <div className="col-span-full mt-6 p-2">
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Adding Project...' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}