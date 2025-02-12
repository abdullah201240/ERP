import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import toast from 'react-hot-toast';
import CreateDesignInvoiceTable from './table/CreateDesignInvoiceTable';

interface WorkingDrawing {
    id: number;
    projectId: string;
    projectName: string;
}

interface Product {
    id: number;
    name: string;
}

export default function AddMaterials() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [workingDrawings, setWorkingDrawings] = useState<WorkingDrawing[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const [user, setUser] = useState<{ id: string; sisterConcernId: string }>({ id: '', sisterConcernId: '' });
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Redirect to home if no token
    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => setIsClient(true), []);

    // Fetch user profile
    const fetchCompanyProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setUser({ id: data.data.id, sisterConcernId: data.data.sisterConcernId });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            fetchCompanyProfile();
        }
    }, [fetchCompanyProfile]);

    // Fetch working drawings
    const fetchWorkingDrawings = useCallback(async () => {
        if (!user.sisterConcernId) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawingSisterConcernId/${user.sisterConcernId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            setWorkingDrawings(data.data);
        } catch (error) {
            console.error('Error fetching working drawings:', error);
        } finally {
            setLoading(false);
        }
    }, [user.sisterConcernId]);

    useEffect(() => {
        if (localStorage.getItem('accessToken')) fetchWorkingDrawings();
    }, [fetchWorkingDrawings]);

    // Fetch products by category
    const fetchProductsByCategory = useCallback(async (page = 1) => {
        if (!user.sisterConcernId || !selectedCategory) return;

        setIsFetchingMore(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL_PROCUREMENT}product/productBySearch/${user.sisterConcernId}?searchProduct=${selectedCategory}&page=${page}&limit=10`
            );
            const data = await response.json();

            setProducts((prev) => (page === 1 ? data.data.products : [...prev, ...data.data.products]));
            setTotalPages(data.data.totalPages);
            setCurrentPage(data.data.currentPage);
        } catch (error) {
            console.error('Error fetching products by category:', error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [user.sisterConcernId, selectedCategory]);

    // Load products when category is selected
    useEffect(() => {
        if (selectedCategory) {
            setProducts([]); // Clear previous products
            fetchProductsByCategory(1);
        }
    }, [selectedCategory, fetchProductsByCategory]);

    // Infinite scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (isFetchingMore || currentPage >= totalPages) return;

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                fetchProductsByCategory(currentPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, totalPages, isFetchingMore, fetchProductsByCategory]);

    // Handle category selection
    const handleCategoryChange = (newValue: { value: string; label: string } | null) => {
        setSelectedCategory(newValue ? newValue.value : null);
    };

    // Handle project selection
    const handleProjectChange = (newValue: { value: number; label: string } | null) => {
        setSelectedProjectId(newValue ? newValue.value : null);
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedProjectId) {
            toast.error('Please select a project!');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineInvoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectId: selectedProjectId }),
            });
            toast.success('Invoice added successfully!');
            setReloadTable((prev) => !prev);
        } catch (error) {
            toast.error('Failed to add invoice');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div>
            <div className="mx-auto max-w-6xl mt-8 pt-12">
                <div className="bg-[#433878] p-8 rounded-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white mb-2">Select Project</label>
                                <Select
                                    options={workingDrawings.map((project) => ({
                                        value: project.id,
                                        label: project.projectName,
                                    }))}
                                    onChange={handleProjectChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Search and select a project"
                                    isLoading={loading}
                                />
                            </div>

                            <div>
                                <label className="text-white mb-2">Product Category</label>
                                <Select
                                    options={[
                                        { value: 'Low', label: 'Low' },
                                        { value: 'Standard', label: 'Standard' },
                                        { value: 'Premium', label: 'Premium' },
                                    ]}
                                    onChange={handleCategoryChange}
                                    isClearable
                                    className="mt-2"
                                    placeholder="Select product category"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full border border-white text-white font-bold py-3 px-4 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </form>
                </div>
            </div>

            {selectedProjectId && <CreateDesignInvoiceTable reload={reloadTable} boqId={selectedProjectId} />}
        </div>
    );
}
