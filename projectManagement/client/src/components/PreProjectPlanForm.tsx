'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Define interfaces for project details and component state
interface Project {
    id: number; // Changed to number based on your API response
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        }
        // Fetch project data from your API
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/all-projects`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setProjects(data.data.projects); // Accessing the projects array
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects');
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(errorMessage);
            }
            finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token, router]);

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = Number(event.target.value);
        setSelectedProject(projectId);

        // Find the selected project details
        const selected = projects.find(project => project.id === projectId);
        if (selected) {
            setProjectDetails({
                projectAddress: selected.projectAddress,
                clientName: selected.clientName,
                clientContact: selected.clientContact,
                projectName: selected.projectName,

            });
        } else {
            setProjectDetails({
                projectAddress: '',
                clientName: '',
                clientContact: '',
                projectName: '',

            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Prepare the data to be sent to the API
        const payload = {
            projectId: selectedProject,
            visitDateTime,
            ...projectDetails
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}siteVisit/create-pre-site-visit-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                toast.error('Failed to add Pre-Project Site Visit Plan');
            }
            if (response.ok) {
                toast.success('Pre-Project Site Visit Plan added successfully!');

            }



            // Optionally, redirect or reset form state here
            // router.push('/some-route'); // Uncomment to redirect after successful submission

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add Pre-Project Site Visit Plan');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="container mx-auto max-w-6xl">
                <div className='bg-[#433878] p-8 rounded-xl'>
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className='text-white mb-2'>Select Project</label>
                                <select
                                    value={selectedProject || ''}
                                    onChange={handleProjectChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a project</option>
                                    {projects.length > 0 ? (
                                        projects.map(project => (
                                            <option key={project.id} value={project.id}>
                                                {project.projectName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No projects available</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className='text-white mb-2'>Project Address</label>
                                <input
                                    type="text"
                                    value={projectDetails.projectAddress}
                                    onChange={(e) => setProjectDetails({
                                        ...projectDetails,
                                        projectAddress: e.target.value
                                    })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className='text-white mb-2'>Client Name</label>
                                <input
                                    type="text"
                                    value={projectDetails.clientName}
                                    onChange={(e) => setProjectDetails({
                                        ...projectDetails,
                                        clientName: e.target.value
                                    })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className='text-white mb-2'>Client Contact</label>
                                <input
                                    type="text"
                                    value={projectDetails.clientContact}
                                    onChange={(e) => setProjectDetails({
                                        ...projectDetails,
                                        clientContact: e.target.value
                                    })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className='text-white mb-2'>Visit Date & Time</label>
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
                            disabled={loading} // Disable button while loading
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding Pre-Project Site Visit Plan...' : 'Add Pre-Project Site Visit Plan'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
