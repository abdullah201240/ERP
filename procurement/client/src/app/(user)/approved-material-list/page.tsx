'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Image from 'next/image'
interface Project {
    id: number;
    projectId: string;
    brandModel: string;
    itemQuantity: string;
    itemDescription: string;
    unit: string;
    category: string;
    projectName: string;
    projectAddress: string;
    clientName: string;
    clientContact: string;
    itemName: string;
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

interface Material {
    id: number;
    projectId: number;
    materialName: string;
    description: string;
    image: string;
}

export default function Page() {
    const router = useRouter();

    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState<{ value: number; label: string } | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(false);

    const [materialName, setMaterialName] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('');

    const [editMaterial, setEditMaterial] = useState<Material | null>(null);
    const [editedName, setEditedName] = useState<string>('');
    const [editedDescription, setEditedDescription] = useState<string>('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenpq');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
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
            router.push('/');
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);

    const fetchProjects = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading(true);
            try {
                if (!employeeDetails) return;
                const token = localStorage.getItem('accessTokenpq');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}projects/view-all-projects/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
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
        const token = localStorage.getItem('accessTokenpq');
        if (!token) {
            router.push('/');
        } else {
            fetchProjects(1, searchQuery);
        }
    }, [searchQuery, router, fetchProjects]);

    const fetchMaterials = useCallback(async (projectId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessTokenpq');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}meterial/meterial?projectId=${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch materials');
            }

            const data = await response.json();
            setMaterials(data.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchMaterials(selectedProject.value);
        }
    }, [selectedProject, fetchMaterials]);

    const handleMenuScrollToBottom = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProjects(nextPage, searchQuery);
        }
    };

    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProject(newValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedProject || !materialName || !description || !image) {
            toast.error('Please fill all fields');
            return;
        }

        const formData = new FormData();
        formData.append('projectId', selectedProject.value.toString());
        formData.append('projectName', selectedProject.label);
        formData.append('materialName', materialName);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('accessTokenpq');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}meterial/meterial`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            await response.json();
            toast.success('Material added successfully!');

            // Reset form fields
            setSelectedProject(null);
            setMaterialName('');
            setDescription('');
            setImage(null);

            // Refresh materials list
            if (selectedProject) {
                fetchMaterials(selectedProject.value);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Failed to add material');
        }
    };

    const handleInputChange = (inputValue: string) => {
        setSearchQuery(inputValue);
        setPage(1);
    };

    const handleEdit = (material: Material) => {
        setEditMaterial(material);
        setEditedName(material.materialName);
        setEditedDescription(material.description);
    };

    const saveEdit = async () => {
        if (!editMaterial) return;
    
        try {
            const token = localStorage.getItem('accessTokenpq');
            const formData = new FormData();
            
            // Append the text fields
            formData.append('materialName', editedName);
            formData.append('description', editedDescription);
    
            // Append the image if selected
            if (image) {
                formData.append('image', image); // 'image' should be the file input's file object
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}meterial/meterial/${editMaterial.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData, // Sending FormData instead of JSON
            });
    
            if (!response.ok) {
                throw new Error('Failed to update material');
            }
    
            const result = await response.json();
            toast.success('Material updated successfully!');
            console.log(result);
    
            // Refresh materials list
            if (selectedProject) {
                fetchMaterials(selectedProject.value);
            }
    
            setEditMaterial(null);
        } catch (error) {
            console.error('Error updating material:', error);
            toast.error('Failed to update material');
        }
    };
    

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const token = localStorage.getItem('accessTokenpq');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}meterial/meterial/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete material');
            }

            await response.json();
            toast.success('Material deleted successfully!');

            // Refresh materials list
            if (selectedProject) {
                fetchMaterials(selectedProject.value);
            }

            setDeleteId(null);
        } catch (error) {
            if (error)
                toast.error('Failed to delete material');
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
                                <label className="text-white mb-2">Material Name</label>
                                <input
                                    type="text"
                                    value={materialName}
                                    onChange={(e) => setMaterialName(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Material Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-white mb-2">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
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
                            Add Materials
                        </button>
                    </form>
                </div>
            </div>

            <div className='mt-12'>
                {selectedProject ? (
                    <>
                        <h1 className='mb-8 font-semibold text-xl'>All Approved Materials</h1>
                        <Table>
                            <TableHeader className='bg-[#2A515B] text-white '>
                                <TableRow className='text-center'>
                                    <TableHead className='text-white text-center'>SI. No.</TableHead>
                                    <TableHead className='text-white text-center'>Material Name</TableHead>
                                    <TableHead className='text-white text-center'>Description</TableHead>
                                    <TableHead className='text-white text-center'>Image</TableHead>
                                    <TableHead className='text-white text-center'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materials.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className='text-center border border-[#e5e7eb]'>
                                            No Materials Found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    materials.map((material, index) => (
                                        <TableRow key={material.id} className='text-center'>
                                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.materialName}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.description}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>
                                                <Image src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${material.image}`} alt={material.materialName} className="w-16 h-16 object-cover" height={100} width={100} />
                                            </TableCell>
                                            <TableCell className='border border-[#e5e7eb] flex items-center justify-center gap-4'>
                                                <FaEdit
                                                    onClick={() => handleEdit(material)}
                                                    className='opacity-50 cursor-pointer text-xl'
                                                />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <RiDeleteBin6Line
                                                            className='opacity-50 cursor-pointer text-xl'
                                                            onClick={() => setDeleteId(material.id)}
                                                        />
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this material? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        Please select a project to view Approved Materials.
                    </div>
                )}
            </div>

            {/* Edit Material Dialog */}
            {editMaterial && (
                <Dialog open={!!editMaterial} onOpenChange={() => setEditMaterial(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Material</DialogTitle>
                        </DialogHeader>
                        <label htmlFor="material-image" className="block mb-2">Name</label>

                        <Input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="mb-4"
                        />
                            <label htmlFor="material-image" className="block mb-2">Description</label>

                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="mb-4"
                            rows={3}
                        />

                        <div className="mb-4">
                            <label htmlFor="material-image" className="block mb-2">Change Image</label>
                            <input
                                id="material-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="block"
                            />
                            
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditMaterial(null)}>Cancel</Button>
                            <Button onClick={saveEdit}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}


        </div>
    );
}