'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import CreateDesignInvoiceTable from './table/CreateDesignInvoiceTable';
import { IoCalendarNumberOutline } from 'react-icons/io5';

interface Boq {
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

interface BoqDetails {
    boqId: string
    projectAddress: string;
    clientName: string;
    clientContact: string;
    boqName: string;
    totalArea: string;
    totalFees: string;
    inputPerSftFees: string;
    subject?: string; // New field for Subject
    nowPayAmount?: string; // New field for Now Pay
}

export default function CreateDesignInvoiceForm() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const [boqs, setBoqs] = useState<Boq[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [boqDetails, setBoqDetails] = useState<BoqDetails>({
        boqId: '',
        projectAddress: '',
        clientName: '',
        clientContact: '',
        boqName: '',
        totalArea: '',
        inputPerSftFees: '',
        totalFees: '',
        subject: '', // Initialize subject
        nowPayAmount: '', // Initialize nowPayAmount
    });
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchBoqs = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/getAllBOQ?page=${pageNumber}&limit=10&search=${query}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                if (pageNumber === 1) {
                    setBoqs(data.data.projects);
                } else {
                    setBoqs((prevProjects) => [...prevProjects, ...data.data.projects]);
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
            fetchBoqs(1, searchQuery);
        }
    }, [token, searchQuery, fetchBoqs]);

    const handleInputChange = (inputValue: string) => {
        setSearchQuery(inputValue);
        setPage(1);
    };

    const handleMenuScrollToBottom = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchBoqs(nextPage, searchQuery);
        }
    };

    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProjectId(newValue ? newValue.value : null);
        if (newValue) {
            const selectedProject = boqs.find((project) => project.id === newValue.value);
            if (selectedProject) {
                setBoqDetails({
                    boqId: String(selectedProject.id),
                    projectAddress: selectedProject.projectAddress,
                    clientName: selectedProject.clientName,
                    clientContact: selectedProject.clientContact,
                    boqName: selectedProject.projectName,
                    totalArea: selectedProject.totalArea,
                    inputPerSftFees: selectedProject.inputPerSftFees,
                    totalFees: selectedProject.totalFees,
                    subject: '', // Reset subject
                    nowPayAmount: '', // Reset nowPayAmount
                });
            }
        }
    };

    useEffect(() => {
        if (boqDetails.inputPerSftFees && boqDetails.totalArea) {
            const calculatedTotalFees =
                parseFloat(boqDetails.inputPerSftFees) * parseFloat(boqDetails.totalArea);
                setBoqDetails((prevDetails) => ({
                ...prevDetails,
                totalFees: calculatedTotalFees.toString(),
            }));
        }
    }, [boqDetails.inputPerSftFees, boqDetails.totalArea]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProjectId || !boqDetails.totalArea) {
            toast.error('Please fill in all the required fields!');
            return;
        }

        try {
            setLoading(true);
           
            // Simulate API call
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}projects/degineInvoice`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(boqDetails),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add BOQ');
            }

            toast.success('Invoice added successfully!');
            setReloadTable((prev) => !prev);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add BOQ');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) {
        return null;
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
                                    options={boqs.map((project) => ({
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
                                    value={new Date().toISOString().split('T')[0]}
                                    disabled
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
                                    value={boqDetails.clientName}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={boqDetails.subject || ''}
                                    onChange={(e) =>
                                        setBoqDetails({
                                            ...boqDetails,
                                            subject: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Subject"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Total Fees in Tk.</label>
                                <input
                                    type="number"
                                    value={boqDetails.totalFees || ''}
                                    disabled
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Now Pay</label>
                                <input
                                    type="text"
                                    value={boqDetails.nowPayAmount || ''}
                                    onChange={(e) =>
                                        setBoqDetails({
                                            ...boqDetails,
                                            nowPayAmount: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Pay Amount"
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'ADD...' : 'Add'}
                        </button>
                    </form>
                </div>
            </div>
            {selectedProjectId && (
                <div className="mt-12">
                    <CreateDesignInvoiceTable reload={reloadTable} boqId={selectedProjectId} />
                </div>
            )}
        </div>
    );
}