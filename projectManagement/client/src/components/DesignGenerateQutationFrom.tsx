'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import DesignBOQTable from './table/DesignBOQTable';
import { IoCalendarNumberOutline } from "react-icons/io5";

import ReactEditor from 'react-text-editor-kit';

interface Project {
    id: number;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
    totalArea: string;
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
}

export default function DesignGenerateQutationForm() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        projectAddress: '',
        clientName: '',
        clientContact: '',
        projectName: '',
        totalArea: '',
    });
    const [inputPerSftFees, setInputPerSftFees] = useState<string>('');
    const [designation, setDesignation] = useState<string>('');
    const [signName, setSignName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessToken');
            if (!storedToken) {
                router.push('/');
            } else {
                setToken(storedToken);
            }
        }
    }, [router]);

    const fetchProjects = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects?page=${pageNumber}&limit=10&search=${query}`,
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
        [token]
    );

    useEffect(() => {
        if (token) {
            fetchProjects(1, searchQuery);
        }
    }, [token, searchQuery, fetchProjects]);

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
                });
            }
        }
    };

    // Auto-calculate Total Fees when inputPerSftFees or totalArea changes
    useEffect(() => {
        if (inputPerSftFees && projectDetails.totalArea) {
            const totalFees = parseFloat(projectDetails.totalArea) * parseFloat(inputPerSftFees);
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                totalFees: totalFees.toFixed(2), // toFixed to ensure decimal precision
            }));
        }
    }, [inputPerSftFees, projectDetails.totalArea]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProject || !inputPerSftFees || !projectDetails.totalArea || !projectDetails.termsCondition || !designation	|| !signName) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        const payload = {
            projectId: selectedProject,
            inputPerSftFees,
            signName,
            designation,

            termsCondition: projectDetails.termsCondition,
            ...projectDetails,
        };

        try {
            setLoading(true);
            console.log(JSON.stringify(payload))
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ`,
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
                throw new Error('Failed to add BOQ ');
            }

            toast.success('BOQ added successfully!');
            setSelectedProject(null);
            setProjectDetails({
                projectAddress: '',
                clientName: '',
                clientContact: '',
                projectName: '',
                totalArea: '',
                totalFees: '', // Reset totalFees
                termsCondition: '', // Reset termsCondition
            });
            setInputPerSftFees('');
            setDesignation('')
            setSignName('')
            setReloadTable((prev) => !prev);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add BOQ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className=" mx-auto max-w-6xl mt-8 pt-12">
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
                                    onChange={(e) =>
                                        setProjectDetails({
                                            ...projectDetails,
                                            clientName: e.target.value,
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Total Built-up Area in sft.</label>
                                <input
                                    type="text"
                                    value={projectDetails.totalArea}
                                    onChange={(e) =>
                                        setProjectDetails({
                                            ...projectDetails,
                                            totalArea: e.target.value,
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Input per sft Fees (Tk.)</label>
                                <input
                                    type="text"
                                    value={inputPerSftFees}
                                    onChange={(e) => setInputPerSftFees(e.target.value)}
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
                                <label className="text-white mb-2">Sign Name</label>
                                <input
                                    type="text"
                                    value={signName}
                                    onChange={(e) => setSignName(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Designation</label>
                                <input
                                    type="text"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="termsCondition" className="block text-white  mb-2">
                                Terms & Condition
                            </label>
                            <ReactEditor
                                value={projectDetails.termsCondition || ""}  // Default to an empty string
                                onChange={(value: string) => {
                                    setProjectDetails({
                                        ...projectDetails,
                                        termsCondition: value,
                                    });
                                }}
                                mainProps={{ className: "black" }}
                                placeholder="Terms & Condition"
                                className="w-full"
                            />
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

            <div className='mt-12'>


            </div>

            <DesignBOQTable reload={reloadTable} />
        </div>
    );
}
