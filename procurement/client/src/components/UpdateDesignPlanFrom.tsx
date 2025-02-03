'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Select from 'react-select';
import { Button } from "@/components/ui/button"
import WorkUpdateAnimationTable from './table/WorkUpdateAnimationTable';
import WorkUpdateDesign3DTable from './table/WorkUpdateDesign3DTable';
import WorkUpdateLayout2DTable from './table/WorkUpdateLayout2DTable';
import WorkUpdateWorkingDrawingTable from './table/WorkUpdateWorkingDrawingTable';
import WorkUpdateRenderingTable from './table/WorkUpdateRenderingTable';
interface Project {
    id: number;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientAddress: string;
    clientContact: string;
}



export default function UpdateDesignPlanFrom() {
    const [token, setToken] = useState<string | null>(null); // State to store token
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState('2D');
    useEffect(() => {
        // Check if we are running on the client-side (to access localStorage)
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessToken');
            if (!storedToken) {
                router.push('/'); // Redirect if no token is found
            } else {
                setToken(storedToken); // Set the token to state
            }
        }
    }, [router]);

    const renderTable = (projectId: number | null) => {
        switch (selected) {
            case '2D': return <WorkUpdateLayout2DTable projectId={projectId}/>;
            case '3D': return <WorkUpdateDesign3DTable projectId={projectId}/>;
            case 'Rendering': return <WorkUpdateRenderingTable projectId={projectId}/>;
            case 'Animation': return <WorkUpdateAnimationTable projectId={projectId}/>;
            case 'Working Drawing': return <WorkUpdateWorkingDrawingTable projectId={projectId}/>;
            default: return null;
        }
    };




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
            } finally {
                setLoading(false);
            }
        },
        [token] // Adding token as a dependency
    );
   
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
            
        }
    }, [token, searchQuery, router,fetchProjects]);

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

    };





    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
           
        }
    }, [token, searchQuery, router, fetchProjects]);


    return (
        <div className='mt-8'>


            <div className="container max-w-8xl">
                <div className='bg-[#433878] p-8 rounded-xl'>
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







                </div>



            </div>
            {selectedProject && (

                <div className='mt-12'>
                    <Button
                        className={`mr-4 mt-8 ${selected === '2D' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('2D')}
                    >
                        2D Layout
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === '3D' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('3D')}
                    >
                        3D Design
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Rendering' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Rendering')}
                    >
                        Rendering
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Animation' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Animation')}
                    >
                        Animation
                    </Button>
                    <Button
                        className={`mr-4 mt-8 ${selected === 'Working Drawing' ? 'bg-[#2A5158] hover:bg-[#2A5158] hover:text-white' : 'bg-white text-black hover:bg-[#2A5158] hover:text-white'}`}
                        onClick={() => setSelected('Working Drawing')}
                    >
                        Working Drawing
                    </Button>

                    <div className='mt-8'>
                        {renderTable(selectedProject)}
                    </div>



                </div>
            )}

        </div>
    )
}
