'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import PreProjectPlanTable from './table/PreProjectPlanTable';
interface Project {
    id: number;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
}

interface ProjectDetails {
    projectAddress: string;
    clientName: string;
    clientContact: string;
    projectName: string;
}

export default function PreProjectPlanForm() {
    const token = localStorage.getItem('accessToken');
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        projectAddress: '',
        clientName: '',
        clientContact: '',
        projectName: '',
    });
    const [visitDateTime, setVisitDateTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);

    const fetchProjects = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects?page=${pageNumber}&limit=10&search=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();

                // If it's the first page, reset the projects; otherwise, append the new projects
                if (pageNumber === 1) {
                    setProjects(data.data.projects);
                } else {
                    setProjects((prevProjects) => [...prevProjects, ...data.data.projects]);
                }

                setTotalPages(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects');
            } finally {
                setLoading(false);
            }
        },
        [token] // Adding token as a dependency
    );
    useEffect(() => {
        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
        }
    }, [token, searchQuery, router, fetchProjects]);




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
                });
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            projectId: selectedProject,
            visitDateTime,
            ...projectDetails,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/create-pre-site-visit-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                toast.error('Failed to add Pre-Project Site Visit Plan');
            } else {
                toast.success('Pre-Project Site Visit Plan added successfully!');
                // Reset the form fields
                setSelectedProject(null);
                setProjectDetails({
                    projectAddress: '',
                    clientName: '',
                    clientContact: '',
                    projectName: '',
                });
                setVisitDateTime('');

                // Trigger table reload
                setReloadTable((prev) => !prev);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add Pre-Project Site Visit Plan');
        }
    };

    return (
        <div>
            <div className="container mx-auto max-w-6xl mt-8">
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

                            <div>
                                <label className="text-white mb-2">Project Address</label>
                                <input
                                    type="text"
                                    value={projectDetails.projectAddress}
                                    onChange={(e) =>
                                        setProjectDetails({
                                            ...projectDetails,
                                            projectAddress: e.target.value,
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
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
                                <label className="text-white mb-2">Client Contact</label>
                                <input
                                    type="text"
                                    value={projectDetails.clientContact}
                                    onChange={(e) =>
                                        setProjectDetails({
                                            ...projectDetails,
                                            clientContact: e.target.value,
                                        })
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Visit Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={visitDateTime}
                                    onChange={(e) => setVisitDateTime(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Adding Pre-Project Site Visit Plan...' : 'Add Pre-Project Site Visit Plan'}
                        </button>
                    </form>
                </div>


            </div>


            <div className="bg-white mt-8 p-4 rounded-xl">
                <h1 className="text-center text-xl mb-4"> Pre Project Site Visit Plan </h1>

                <div className="w-[98vw] md:w-full">
                    <PreProjectPlanTable reload={reloadTable} />
                </div>

            </div>






        </div>


    );
}
