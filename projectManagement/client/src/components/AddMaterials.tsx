'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import MaterialsTable from './table/MaterialsTable';

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

interface ProjectDetails {
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

interface Products {
    id: number;
    name: string;
    brand: string;
    countryOfOrigin: string;
    supplierProductCode: string;
    sizeAndDimension: string;
    ourProductCode: string;
    mrpPrice: string;
    discountPercentage: string;
    discountAmount: string;
    sourcePrice: string;
    unit: string;
    product_category: string;
}

export default function AddMaterials() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<Products[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);

    const [selectedProject, setSelectedProject] = useState<number | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        id: null || 0,
        projectId: '',
        brandModel: '',
        itemQuantity: '',
        itemDescription: '',
        unit: '',
        category: '',
        projectName: '',
        projectAddress: '',
        clientName: '',
        clientContact: '',
        itemName: '',
    });

    const [productDetails, setProductDetails] = useState<Products>({
        id: null || 0,
        name: '',
        brand: '',
        countryOfOrigin: '',
        supplierProductCode: '',
        ourProductCode: '',
        mrpPrice: '',
        discountPercentage: '',
        discountAmount: '',
        sourcePrice: '',
        unit: '',
        product_category: '',
        sizeAndDimension: '',
    });

    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [page1, setPage1] = useState(1);
    const [totalPages1, setTotalPages1] = useState(1);
    const [reloadTable, setReloadTable] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [projectSelected, setProjectSelected] = useState(false);
    const [itemQuantity, setItemQuantity] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("no token");
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
            console.table(data.data);
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

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {

            if (!employeeDetails) return;
            const token = localStorage.getItem('accessToken');


            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingSisterConcernId/${employeeDetails.sisterConcernId}`,
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
            setProjects(data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, [ employeeDetails]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("no token");
            router.push('/');
        } else {
            fetchProjects();
        }
    },  [router, fetchProjects]);

    const fetchProducts = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading1(true);
            try {
                if (!employeeDetails) return;
                const token = localStorage.getItem('accessToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_PROCUREMENT}product/productBySearch/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&searchProduct=${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                if (pageNumber === 1) {
                    setProducts(data.data.products);
                    setFilteredProducts(data.data.products);
                } else {
                    setProducts((prevProducts) => [...prevProducts, ...data.data.products]);
                    setFilteredProducts((prevProducts) => [...prevProducts, ...data.data.products]);
                }

                setTotalPages1(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading1(false);
            }
        },
        [employeeDetails]
    );

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("no token");
            router.push('/');
        } else {
            fetchProducts(1, selectedCategory || '');
        }
    }, [ selectedCategory, router, fetchProducts]);

    const handleInputChange1 = () => {
        setPage1(1);
    };

    const handleMenuScrollToBottom1 = () => {
        if (page1 < totalPages1) {
            const nextPage1 = page1 + 1;
            setPage1(nextPage1);
            fetchProducts(nextPage1, selectedCategory || '');
        }
    };

    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProject(newValue ? newValue.value : null);
        if (newValue) {
            const selected = projects.find((project) => project.id === newValue.value);
            if (selected) {
                setProjectDetails({
                    id: selected.id,
                    projectId: selected.projectId,
                    brandModel: selected.brandModel,
                    itemQuantity: selected.itemQuantity,
                    itemDescription: selected.itemDescription,
                    unit: selected.unit,
                    category: selected.category,
                    projectName: selected.projectName,
                    projectAddress: selected.projectAddress,
                    clientName: selected.clientName,
                    clientContact: selected.clientContact,
                    itemName: selected.itemName,
                });
            }
        }
        setProjectSelected(!!newValue);
    };

    const handleCategoryChange = (newValue: { value: string; label: string } | null) => {
        const category = newValue ? newValue.value : null;
        setSelectedCategory(category);
        fetchProducts(1, category || '');
    };

    const handleProductChange = (newValue: { value: number; label: string } | null) => {
        if (newValue) {
            const selected = products.find((product) => product.id === newValue.value);
            if (selected) {
                setProductDetails({
                    id: selected.id,
                    name: selected.name,
                    brand: selected.brand,
                    countryOfOrigin: selected.countryOfOrigin,
                    supplierProductCode: selected.supplierProductCode,
                    ourProductCode: selected.ourProductCode,
                    mrpPrice: selected.mrpPrice,
                    discountPercentage: selected.discountPercentage,
                    discountAmount: selected.discountAmount,
                    sourcePrice: selected.sourcePrice,
                    unit: selected.unit,
                    product_category: selected.product_category,
                    sizeAndDimension: selected.sizeAndDimension,
                });
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!itemQuantity) return;
        const payload = {

            ...projectDetails,
            ...productDetails,
            itemNeed: itemQuantity,
            sisterConcernId: employeeDetails?.sisterConcernId,
            productId:productDetails.id,
            productName: productDetails.name,
            projectId: projectDetails.id,
            
        };
        console.log(payload)

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/material`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                toast.error('Failed to add Materials');
            } else {
                toast.success('Materials added successfully!');
                setReloadTable((prev) => !prev);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add Materials');
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
                                        label: project.projectName + `(${project.itemName})`,
                                    }))}
                                    onChange={handleProjectChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select a project"
                                    isLoading={loading}
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Select Category</label>
                                <Select
                                    options={[
                                        { value: 'Low', label: 'Low' },
                                        { value: 'Standard', label: 'Standard' },
                                        { value: 'Premium', label: 'Premium' },
                                    ]}
                                    onChange={handleCategoryChange}
                                    className="mt-2"
                                    placeholder="Search and select a category"
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Select Products</label>
                                <Select
                                    options={filteredProducts.map((product) => ({
                                        value: product.id,
                                        label: product.name + `(${product.product_category})`,
                                    }))}
                                    onInputChange={handleInputChange1}
                                    onMenuScrollToBottom={handleMenuScrollToBottom1}
                                    onChange={handleProductChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select a product"
                                    isLoading={loading1}
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(e.target.value)}
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
                            {loading ? 'Adding Project Add Materials...' : 'Add Materials'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white mt-8 p-4 rounded-xl">
                <h1 className="text-center text-xl mb-4">All Materials</h1>
                <div className="w-[98vw] md:w-full">
                    {projectSelected && selectedProject !== null && (
                        <MaterialsTable reload={reloadTable} projectId={selectedProject} />
                    )}
                </div>
            </div>
        </div>
    );
}


