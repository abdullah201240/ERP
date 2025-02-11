'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import DesignFinalGenerateQutationTable from './table/DesignFinalGenerateQutationTable';
import { IoCalendarNumberOutline } from "react-icons/io5";

interface Project {
    id: number;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
    totalArea: string;
    inputPerSftFees: string;
    totalFees: string;
}

interface ProjectDetails {
    projectAddress: string;
    clientName: string;
    clientContact: string;
    projectName: string;
    totalArea: string;
    totalFees?: string; // Add totalFees for calculated fee
    inputPerSftFees?: string; // Input per sft Fees
    termsCondition?: string; // Terms and Condition
    serviceAmount?: string; // Amount entered if selected (for fixed amount)
    servicePercentage?: string; // Percentage entered if selected
    serviceId?: string; // Amount entered if selected (for fixed amount)

    selectedService?: Service; // Selected service details
}

interface Service {
    id: number;
    name: string;
    description: string;
}

export default function DesignFinalGenerateQutationFrom() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        projectAddress: '',
        clientName: '',
        clientContact: '',
        projectName: '',
        totalArea: '',
        inputPerSftFees: '',
        totalFees: '',
        termsCondition: '', // Initialize termsCondition
    });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);
    const [isPercentage, setIsPercentage] = useState(false); // Track if percentage checkbox is checked
    const [services, setServices] = useState<Service[]>([]); // New state for services
    const [user, setUser] = useState({ name: '', email: '', id: '', sisterConcernId: '' });



    useEffect(() => {
        
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
            } 
        
    }, [router]);

    useEffect(() => {
        setIsClient(true); // Marks that we are in the client-side
    }, []);
    const fetchCompanyProfile = useCallback(async () => {
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setUser({ name: data.data.name, email: data.data.email, id: data.data.id, sisterConcernId: data.data.sisterConcernId });

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

    const fetchProjects = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            if(!user.sisterConcernId){
                return
            }
            try {
                
                const token = localStorage.getItem('accessToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/getAllBOQ/${user.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                if (pageNumber === 1) {
                    setProjects(data.data.projects);
                } else {
                    setProjects((prevProjects) => [...prevProjects, ...data.data.projects]);
                }

                setTotalPages(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        },
        [user]
    );
    // Fetch Services
    const fetchServices = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/services`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const data = await response.json();
            setServices(data.data); // Store the services data
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchProjects(1, searchQuery);
            fetchServices(); // Fetch services when the token is available
        }
    }, [ searchQuery, fetchProjects, fetchServices]);

    const handleInputChange = (inputValue: string) => {
        setSearchQuery(inputValue);
        setPage(1);
    };

    const handleMenuScrollToBottom = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, searchQuery);
        }
    };

    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProject(newValue ? newValue.value : null);
        if (newValue) {
            const selected = projects.find((project) => project.id === newValue.value);
            if (selected) {
                setProjectDetails({
                    projectAddress: selected.projectAddress,
                    clientName: selected.clientName,
                    clientContact: selected.clientContact,
                    projectName: selected.projectName,
                    totalArea: selected.totalArea,
                    inputPerSftFees: selected.inputPerSftFees,
                    totalFees: selected.totalFees,
                    termsCondition: '', // Initialize termsCondition
                });
            }
        }
    };

    // Auto-calculate Total Fees when inputPerSftFees or totalArea change
    useEffect(() => {
        if (projectDetails.inputPerSftFees && projectDetails.totalArea) {
            const calculatedTotalFees =
                parseFloat(projectDetails.inputPerSftFees) * parseFloat(projectDetails.totalArea);
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                totalFees: calculatedTotalFees.toString(),
            }));
        }
    }, [projectDetails.inputPerSftFees, projectDetails.totalArea]);

    // Handle Service Selection
    const handleServiceChange = (newValue: { value: number; label: string } | null) => {
        if (newValue) {
            const selectedService = services.find((service) => service.id === newValue.value);
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                selectedService: selectedService || undefined,
            }));
        } else {
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                selectedService: undefined,
            }));
        }
    };
    // Handle Checkbox Change for Amount or Percentage
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPercentage(event.target.checked); // Toggle between percentage and amount
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProject || !projectDetails.totalArea) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        // Get the selected service details
        const selectedService = projectDetails.selectedService;

        const payload = {
            boqId: selectedProject,
            serviceName: selectedService?.name, // Service name
            serviceDescription: selectedService?.description, // Service description
            serviceId: selectedService?.id,
            ...projectDetails, // Include other project details
        };


        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQPart`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add BOQ');
            }

            toast.success('BOQ added successfully!');
            
            
            setReloadTable((prev) => !prev); // Reload the table after submission
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add BOQ');
        } finally {
            setLoading(false);
        }
    };



    if (!isClient) {
        return null; // Or show a loading state
    }

    return (
        <div>
            <div className="mx-auto max-w-6xl mt-8 pt-12">
                <div className="bg-[#433878] p-8 rounded-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white mb-2">Select Project</label>
                                <Select
                                    options={projects.map((project) => ({
                                        value: project.id,
                                        label: project.projectName,
                                    }))}
                                    onInputChange={handleInputChange}
                                    onMenuScrollToBottom={handleMenuScrollToBottom}
                                    onChange={handleProjectChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select a project"
                                    isLoading={loading}
                                />
                            </div>
                            <div className="relative">
                                <label className="text-white mb-2">Date</label>
                                <input
                                    type="text"
                                    value={new Date().toISOString().split('T')[0]} // Sets the value to today's date
                                    disabled // Disables the input field
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2 pl-10"
                                    placeholder="Select Date"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl mt-4">
                                    <IoCalendarNumberOutline />
                                </span>
                            </div>
                            <div>
                                <label className="text-white mb-2">Client Name</label>
                                <input
                                    type="text"
                                    value={projectDetails.clientName}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Total Built-up Area in sft.</label>
                                <input
                                    type="text"
                                    value={projectDetails.totalArea}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Total Fees in Tk.</label>
                                <input
                                    type="number"
                                    value={projectDetails.totalFees || ''}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Per sft Fees</label>
                                <input
                                    type="number"
                                    value={projectDetails.inputPerSftFees || ''}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            {/* Service Dropdown */}
                            <div>
                                <label className="text-white mb-2">Select Service</label>
                                <Select
                                    options={services.map((service) => ({
                                        value: service.id,
                                        label: service.name,
                                    }))}
                                    onChange={handleServiceChange}
                                    className="mt-2"
                                    placeholder="Search and select a service"
                                    isLoading={loading}
                                />
                            </div>

                            {isPercentage ? (
                                <div>
                                    <label className="text-white mb-2">Enter Percentage
                                        <input
                                            type="checkbox"
                                            checked={isPercentage}
                                            onChange={handleCheckboxChange}
                                            className="mr-2"
                                        />
                                        <label className="text-white mb-2">%</label>



                                    </label>
                                    <input
                                        type="number"
                                        value={projectDetails.servicePercentage || ''}
                                        onChange={(e) =>
                                            setProjectDetails({
                                                ...projectDetails,
                                                servicePercentage: e.target.value,
                                            })
                                        }
                                        placeholder='Enter Percentage'

                                        className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="text-white mb-2 ">Enter Amount

                                        <input
                                            type="checkbox"
                                            checked={isPercentage}
                                            onChange={handleCheckboxChange}
                                            className="mr-2 ml-2"
                                        />
                                        <label className="text-white mb-2">%</label>

                                    </label>
                                    <input
                                        type="number"
                                        value={projectDetails.serviceAmount || ''}
                                        onChange={(e) =>
                                            setProjectDetails({
                                                ...projectDetails,
                                                serviceAmount: e.target.value,
                                            })
                                        }
                                        placeholder='Enter Amount'
                                        className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                    />
                                </div>
                            )}

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'ADD...' : 'Add'}
                        </button>
                    </form>
                </div>
            </div>
            {selectedProject &&

                <div className="mt-12">
                    <DesignFinalGenerateQutationTable reload={reloadTable} boqId={selectedProject} />
                </div>
            }

        </div>
    );
}