'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import UploadWorkingDrawingTable from './table/UploadWorkingDrawingTable';
import { Icon } from '@iconify/react';

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

interface MyFormData {
    unit: string;
    category: string;
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
    const [formData, setFormData] = useState<MyFormData>({
        unit: '',
        category: '',
    });

    const [itemName, setItemName] = useState<string>('');
    const [itemDescription, setItemDescription] = useState<string>('');
    const [brandModel, setBrandModel] = useState<string>('');
    const [itemQuantity, setItemQuantity] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
    const [uploadDesignWorkingDrawings, setUploadDesignWorkingDrawings] = useState<File[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    useEffect(() => {
       
            const storedToken = localStorage.getItem('accessToken');
            if (!storedToken) {
                router.push('/');
            } 
        
    }, [router]);
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.table(data.data)
            if (data.success) {
                setEmployeeDetails(data.data);
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
                const token = localStorage.getItem('accessToken');

                if (!employeeDetails) return;

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}projects/view-all-projects/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
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
        [employeeDetails]
    );

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchProjects(1, searchQuery);
        }
    }, [ searchQuery, fetchProjects]);

    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!employeeDetails) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/category?sisterConcernId=${employeeDetails.sisterConcernId}`, {
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
    }, [employeeDetails]);

    const fetchUnit = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!employeeDetails) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROCUREMENT}product/unit/${employeeDetails.sisterConcernId}`, {
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
    }, [employeeDetails]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchCategories();
            fetchUnit();
        }
    }, [ fetchCategories, fetchUnit]);

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
        setSelectedProjectId(newValue ? newValue.value : null);

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
            setUploadDesignWorkingDrawings(Array.from(e.target.files));
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProject) {
            toast.error('Please select a project');
            return;
        }

        const form = new FormData();
        form.append('projectId', selectedProject.toString());
        form.append('itemName', itemName);
        form.append('brandModel', brandModel);
        form.append('itemQuantity', itemQuantity);
        form.append('itemDescription', itemDescription);
        form.append('unit', formData.unit);
        form.append('category', formData.category);
        form.append('clientName', projectDetails.clientName);
        form.append('clientContact', projectDetails.clientContact);
        form.append('projectAddress', projectDetails.projectAddress);
        form.append('projectName', projectDetails.projectName);

        // Append each file
        uploadDesignWorkingDrawings.forEach((file) => {
            form.append('designDrawings', file);
        });

        try {
            // Log FormData properly
            
            for (const pair of form.entries()) {
                console.log(pair[0], pair[1]);
            }
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                },
                body: form, // Use FormData directly
            });

            if (!response.ok) {
                toast.error('Failed to add working drawing');
            } else {
                toast.success('Working drawing added successfully!');

                // Reset form
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
                setUploadDesignWorkingDrawings([]);
                setReloadTable((prev) => !prev);
            }
        } catch (error) {
            if(error){
                toast.error('Failed to add working drawing');

            }
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
                                    multiple
                                    accept="image/*"

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
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? <Icon icon="svg-spinners:6-dots-scale" width="24" height="24" /> : 'Adding upload working drawing'}
                        </button>
                    </form>
                </div>
            </div>
            {selectedProjectId && (
            <div className="bg-white mt-8 p-4 rounded-xl">
                <h1 className="text-center text-xl mb-4">Working Drawing</h1>
                <div className="w-[98vw] md:w-full">
                    <UploadWorkingDrawingTable reload={reloadTable} projectId={String(selectedProjectId)} />
                </div>
            </div>
            )}
        </div>
    
    );
}