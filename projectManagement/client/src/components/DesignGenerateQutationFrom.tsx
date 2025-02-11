'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import DesignBOQTable from './table/DesignBOQTable';
import { IoCalendarNumberOutline } from "react-icons/io5";
import dynamic from 'next/dynamic';
const ReactEditor = dynamic(() => import('react-text-editor-kit'), {
    ssr: false,
});

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

export default function DesignGenerateQutationForm() {
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

    });
    const [inputPerSftFees, setInputPerSftFees] = useState<string>('');
    const [designation, setDesignation] = useState<string>('');
    const [signName, setSignName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);
    const [subject, setSubject] = useState('');
    const [firstPera, setFirstPera] = useState('');
    const [secondPera, setSecondPera] = useState('');
    const [feesProposal, setFeesProposal] = useState('');
    const [feesProposalNote1, setFeesProposalNote1] = useState('');
    const [feesProposalNote2, setFeesProposalNote2] = useState('');
    const [date, setDate] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    const [user, setUser] = useState({ name: '', email: '', id: '', sisterConcernId: '' });




    useEffect(() => {

        const storedToken = localStorage.getItem('accessToken');
        if (!storedToken) {
            router.push('/');
        } else {
            setDate(new Date().toISOString().split('T')[0])
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
            console.table(data.data)
            if (data.success) {
                setEmployeeDetails(data.data);
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
            try {
                if (!employeeDetails) return;
                const token = localStorage.getItem('accessToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
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
        [employeeDetails]
    );

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchProjects(1, searchQuery);
        }
    }, [searchQuery, fetchProjects]);

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

        if (!selectedProject || !inputPerSftFees || !projectDetails.totalArea || !projectDetails.termsCondition || !designation || !signName) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        const payload = {
            projectId: selectedProject,
            inputPerSftFees,
            signName,
            designation,
            subject,               // Add subject
            firstPera,             // Add firstPera
            secondPera,
            feesProposal,           // Add secondPera
            feesProposalNote1,     // Add feesProposalNote1
            feesProposalNote2,
            date,
            sisterConcernId: user.sisterConcernId,


            termsCondition: projectDetails.termsCondition,
            ...projectDetails,
        };

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
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
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData('text');
    
        // Assuming `setProjectDetails` and `projectDetails` are from your existing state management
        setProjectDetails((prevState: ProjectDetails) => ({
            ...prevState,
            termsCondition: prevState.termsCondition + pastedData,
        }));
    };
    if (!isClient) {
        return null; // Or show a loading state
    }

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
                            <div>
                                <label className="text-white mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">First Paragraph</label>
                                <input
                                    type="text"
                                    value={firstPera}
                                    onChange={(e) => setFirstPera(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Second Paragraph</label>
                                <input
                                    type="text"
                                    value={secondPera}
                                    onChange={(e) => setSecondPera(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Fees Proposal</label>
                                <input
                                    type="text"
                                    value={feesProposal}
                                    onChange={(e) => setFeesProposal(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Note 01</label>
                                <input
                                    type="text"
                                    value={feesProposalNote1}
                                    onChange={(e) => setFeesProposalNote1(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Note 02</label>
                                <input
                                    type="text"
                                    value={feesProposalNote2}
                                    onChange={(e) => setFeesProposalNote2(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                        </div>

                        <div className="mb-6">
                            <label htmlFor="termsCondition" className="block text-white  mb-2">
                                Terms & Condition
                            </label>
                            <div onPaste={handlePaste}>
                                <ReactEditor
                                    value={projectDetails.termsCondition || ""}
                                    onChange={(value) => {
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
