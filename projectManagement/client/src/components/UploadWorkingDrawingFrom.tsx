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

interface FormData {
    unit: string;
    category: string;
}

export default function UploadWorkingDrawingFrom() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        projectAddress: '',
        clientName: '',
        clientContact: '',
        projectName: '',
    });
    const [formData, setFormData] = useState<FormData>({
        unit: '',
        category: '',
    });
    const [itemName, setItemName] = useState<string>('');
    const [uploadDesignWorkingDrawing, setUploadDesignWorkingDrawing] = useState<File | null>(null);
    const [itemDescription, setItemDescription] = useState<string>('');
    const [brandModel, setBrandModel] = useState<string>('');
    const [itemQuantity, setItemQuantity] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

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
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects?page=${pageNumber}&limit=50&search=${query}`,
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

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/category`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch categories');
            const result = await response.json();
            setCategories(result.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [token]);

    const fetchUnit = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROCUREMENT}product/unit`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch units');
            const result = await response.json();
            setUnits(result.data || []);
        } catch (error) {
            console.error('Error fetching units:', error);
            setUnits([]);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchCategories();
            fetchUnit();
        }
    }, [token, fetchCategories, fetchUnit]);

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadDesignWorkingDrawing(e.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            projectId: selectedProject,
            itemName,
            ...projectDetails,
            ...formData,
            brandModel,
            itemQuantity,
            itemDescription,
            uploadDesignWorkingDrawing,
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
                setSelectedProject(null);
                setProjectDetails({
                    projectAddress: '',
                    clientName: '',
                    clientContact: '',
                    projectName: '',
                });
                setItemName('');
                setFormData({ unit: '', category: '' });
                setBrandModel('');
                setItemQuantity('');
                setItemDescription('');
                setUploadDesignWorkingDrawing(null);
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
                                <label className="text-white mb-2">Units</label>
                                <select
                                    required
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a unit</option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.name}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-white mb-2">Category</label>
                                <select
                                    required
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
                                <label className="text-white mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Upload Design Working Drawing</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Brand & Model</label>
                                <input
                                    type="text"
                                    value={brandModel}
                                    onChange={(e) => setBrandModel(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Item Quantity</label>
                                <input
                                    type="number"
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white mb-2">Item Description</label>
                            <textarea
                                value={itemDescription}
                                rows={4}
                                onChange={(e) => setItemDescription(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Adding Pre-Project Site Visit Plan...' : 'Add Pre-Project Site Visit Plan'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white mt-8 p-4 rounded-xl">
                <h1 className="text-center text-xl mb-4">Pre Project Site Visit Plan</h1>
                <div className="w-[98vw] md:w-full">
                    <PreProjectPlanTable reload={reloadTable} />
                </div>
            </div>
        </div>
    );
}