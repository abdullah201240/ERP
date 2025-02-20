'use client'
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Select from 'react-select';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';

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
} from "@/components/ui/alert-dialog";
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Drawing {
    id: number;
    projectId: string;
    itemName: string;
    brandModel: string;
    category: string;
    clientName: string;
    clientContact: string;
    projectAddress: string;
    projectName: string;
    createdAt: string;
    status: string;
    itemQuantity?: string;
    itemDescription?: string;
    unit?: string;
}

interface Img {
    id: number;
    imageName: string;
    workingDrawingId: string;
}

interface Materials {
    id: number;
    brand: string;
    brandModel?: string;
    category: string;
    clientContact: string;
    clientName: string;
    countryOfOrigin: string;
    discountAmount: string;
    discountPercentage: string;
    productId: string;
    itemDescription: string;
    itemName: string;
    itemNeed: string;
    itemQuantity: string;
    mrpPrice: string;
    productName: string;
    ourProductCode: string;
    product_category: string;
    projectAddress: string;
    projectId: string;
    projectName: string;
    sourcePrice: string;
    supplierProductCode: string;
    unit: string;
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


interface ProductionWorkPlan {
    id: number;
    workingDrawingsId: string;
    assignee: string;

    workType: string;

    startDate: string;

    endDate: string;

    remarks: string;

    completed: string;
    employeeName: string


}

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params?.project;
    const projectId = params?.id;
    const [drawings, setDrawings] = useState<Drawing | null>(null);
    const [productionWorkPlans, setProductionWorkPlans] = useState<ProductionWorkPlan[]>([]);

    const [images, setImages] = useState<Img[]>([]);
    const [materialList, setMaterialList] = useState<Materials[]>([]);

    // State variables for the modal form
    const [workType, setWorkType] = useState('');

    const [assignee, setAssignee] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [loading1, setLoading1] = useState(false);
    const [searchQuery1, setSearchQuery1] = useState('');
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [page1, setPage1] = useState(1);
    const [totalPages1, setTotalPages1] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedWorkPlan, setSelectedWorkPlan] = useState<ProductionWorkPlan | null>(null);
    const [selectedEmployeeOption, setSelectedEmployeeOption] = useState<{ value: string; label: string } | null>(null);

    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}employee/auth/profile`, {
                    headers: { 'Authorization': token }
                });
                if (!response.ok) {
                    router.push('/');
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
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
    const fetchEmployee = useCallback(
        async (pageNumber = 1, query = '') => {
            setLoading1(true);
            try {
                if (!employeeDetails) return;
                const token = localStorage.getItem('accessToken');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_ADMIN}sisterConcern/employee/${employeeDetails.sisterConcernId}?page=${pageNumber}&limit=10&search=${query}`,
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
                    setEmployees(data.data.employees);
                } else {
                    setEmployees((prev) => [...prev, ...data.data.employees]);
                }

                setTotalPages1(data.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading1(false);
            }
        },
        [employeeDetails] // Adding token as a dependency
    );
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        } else {
            fetchCompanyProfile();
        }
    }, [router, fetchCompanyProfile]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {

            fetchEmployee(1, searchQuery1)


        }
    }, [router, searchQuery1, fetchEmployee]);

    const fetchDrawings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setDrawings(data.data || null);
            setImages(data.data.images || []);
            setMaterialList(data.data.materialList || []);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings(null);
        }
    }, [router, id]);

    const fetchProductionWorkPlan = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/productionWorkPlan/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch ProductionWorkPlan");
            const data = await response.json();

            setProductionWorkPlans(data.data || null);





        } catch (error) {
            console.error("Error fetching ProductionWorkPlan:", error);
        }
    }, [router, id]);



    useEffect(() => {
        fetchDrawings();
        fetchProductionWorkPlan();
    }, [fetchDrawings, fetchProductionWorkPlan]);

    const handleInputChange1 = (inputValue: string) => {
        setSearchQuery1(inputValue);
        setPage1(1);
    };

    const handleMenuScrollToBottom1 = () => {
        if (page1 < totalPages1) {
            const nextPage = page1 + 1;
            setPage1(nextPage);
            fetchEmployee(nextPage, searchQuery1);
        }
    };
    const handleEmployeeChange = (newValue: { value: string; label: string } | null) => {
        if (newValue) {
            setAssignee(newValue.value); // Set the assignee ID
            setSelectedEmployeeOption(newValue); // Set the selected option for the Select component
        } else {
            setAssignee(null); // Clear the assignee ID
            setSelectedEmployeeOption(null); // Clear the selected option
        }
    };
    const handleDelete = async () => {
        if (deleteId === null) return;
        const token = localStorage.getItem('accessToken');

        if (!token) {
            router.push('/');
        } else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/productionWorkPlan/${deleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }

                setProductionWorkPlans(prevProjects => prevProjects.filter(project => project.id !== deleteId));
            } catch (err) {
                setError((err as Error).message);
            }
        }
    };

    const handleEdit = (workPlan: ProductionWorkPlan) => {
        setSelectedWorkPlan(workPlan);
        setWorkType(workPlan.workType);
        setStartDate(workPlan.startDate);
        setEndDate(workPlan.endDate);
        setRemarks(workPlan.remarks);

        // Find the employee object that matches the assignee ID
        const selectedEmployee = employees.find((employee) => employee.id === workPlan.assignee);
        if (selectedEmployee) {
            setAssignee(selectedEmployee.id); // Set the assignee ID
            setSelectedEmployeeOption({ value: selectedEmployee.id, label: selectedEmployee.name }); // Set the option for the Select component
        }

        setIsModalOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const stepData = {
            workingDrawingsId: id,
            projectId,
            assignee,
            workType,
            startDate,
            endDate,
            remarks,
        };

        try {
            const token = localStorage.getItem('accessToken');
            const url = selectedWorkPlan
                ? `${process.env.NEXT_PUBLIC_API_URL}workingDrawing/productionWorkPlan/${selectedWorkPlan.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}workingDrawing/productionWorkPlan`;

            const method = selectedWorkPlan ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(stepData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            await response.json();
            toast.success(selectedWorkPlan ? 'Work Plan updated successfully!' : 'Work Plan added successfully!');
            setIsModalOpen(false);
            await fetchProductionWorkPlan();
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error(selectedWorkPlan ? 'Failed to update Work Plan' : 'Failed to add Work Plan');
        }
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedWorkPlan(null);
        setWorkType('');
        setAssignee(null);
        setStartDate('');
        setEndDate('');
        setRemarks('');
        setSelectedEmployeeOption(null); // Reset the selected employee option
    };


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-2 md:p-5">
            <h1 className="text-2xl font-bold mb-4">Create Production Work Plan</h1>


            {drawings ? (
                <div className="bg-white p-4 md:p-12 shadow rounded">
                    <div className="flex justify-center items-center bg-[#f0f0f0] p-2">
                        <h2 className="text-xl font-semibold">Project: {drawings.projectName}</h2>
                    </div>
                    <div className="flex justify-start items-center bg-[#D9D9D933] p-4 mt-4">
                        <h2 className="text-xl font-semibold"> {drawings.category}</h2>
                    </div>
                    <div className='mt-4'>
                        <p><strong>Item Name:</strong> {drawings.itemName}</p>
                        <p><strong>Item Description:</strong> {drawings.itemDescription}</p>
                        <p><strong>Brand Model:</strong> {drawings.brandModel}</p>
                        <p><strong>Item Quantity:</strong> {drawings.itemQuantity}</p>

                        <p><strong>Item Unit:</strong> {drawings.unit}</p>


                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 mt-2">
                        {images.map(image => (
                            <div key={image.id} className="w-full h-auto">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${image.imageName}`}
                                    alt={image.imageName}
                                    className="w-full h-auto object-contain rounded"
                                    layout="responsive"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='mt-16 '>
                        <h1 className="mt-4 mb-8 text-lg font-semibold">{drawings.itemName} Working Drawing Material List</h1>


                        <Table>
                            <TableHeader className='bg-[#2A515B] text-white'>
                                <TableRow className='text-center'>
                                    <TableHead className='text-white text-center'>SI. No.</TableHead>

                                    <TableHead className='text-white text-center'>Product Code</TableHead>
                                    <TableHead className='text-white text-center'>Product Name</TableHead>
                                    <TableHead className='text-white text-center'>Product Category</TableHead>
                                    <TableHead className='text-white text-center'>Quantity</TableHead>
                                    <TableHead className='text-white text-center'>Total Quantity</TableHead>
                                    <TableHead className='text-white text-center'>Unit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materialList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                            No  Product found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    materialList.map((material, index) => (
                                        <TableRow key={material.id} className='text-center'>
                                            <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.ourProductCode}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.productName}</TableCell>

                                            <TableCell className='border border-[#e5e7eb]'>{material.product_category}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.itemNeed}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{Number(material.itemNeed) * Number(material.itemQuantity)}</TableCell>
                                            <TableCell className='border border-[#e5e7eb]'>{material.unit}</TableCell>


                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>




                    </div>

                    <div className='mt-16 '>


                        <h1 className="mt-4 mb-8 text-lg font-semibold"> item: {drawings.itemName} </h1>
                        <div className='mb-4 mt-4'>
                            <Button onClick={() => setIsModalOpen(true)} className="mb-4 bg-[#ea580b] hover:bg-[#29515b]">+ Add Work </Button>

                        </div>
                        <Table>
                            <TableHeader className='bg-[#2A515B] text-white'>
                                <TableRow className='text-center'>
                                    <TableHead className='text-white text-center'>SI. No.</TableHead>
                                    <TableHead className='text-white text-center'>Type of work</TableHead>
                                    <TableHead className='text-white text-center'>Start Date</TableHead>
                                    <TableHead className='text-white text-center'>End Date</TableHead>
                                    <TableHead className='text-white text-center'>Time Required</TableHead>
                                    <TableHead className='text-white text-center'>Assignee</TableHead>
                                    <TableHead className='text-white text-center'>Remarks</TableHead>
                                    <TableHead className='text-white text-center'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productionWorkPlans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className='text-center border border-[#e5e7eb]'>
                                            No Production Work Plan found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    productionWorkPlans.map((productionWorkPlan, index) => {
                                        // Calculate time required in days
                                        const startDate = new Date(productionWorkPlan.startDate);
                                        const endDate = new Date(productionWorkPlan.endDate);
                                        const timeRequired = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                                        return (
                                            <TableRow key={productionWorkPlan.id} className='text-center'>
                                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.workType}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.startDate}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.endDate}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{timeRequired + 1} days</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.employeeName}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{productionWorkPlan.remarks}</TableCell>
                                                <TableCell className='border border-[#e5e7eb] text-3xl flex items-center justify-center'>
                                                    <FaEdit
                                                        onClick={() => handleEdit(productionWorkPlan)}
                                                        className='mr-8 opacity-50 cursor-pointer'
                                                    />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <RiDeleteBin6Line
                                                                className='opacity-50 cursor-pointer'
                                                                onClick={() => setDeleteId(productionWorkPlan.id)}
                                                            />
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirm Production Work Plan Deletion</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this Production Work Plan? This action cannot be undone, and the Production Work Plan will be permanently removed from the system.
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
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                    </div>


                </div>
            ) : (
                <p>Loading...</p>
            )}

{isModalOpen && (
    <div
        id="default-modal"
        tabIndex={isModalOpen ? 0 : -1}
        aria-hidden={!isModalOpen}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isModalOpen ? "block" : "hidden"}`}
    >
        <div className="relative w-full max-w-lg p-4 mx-2 bg-white rounded-lg shadow-lg dark:bg-gray-800 mb-16">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedWorkPlan ? 'Edit Work Plan' : 'Add Work Plan'}
                </h3>
                <button
                    type="button"
                    onClick={handleModalClose}
                    className="text-gray-400 rounded-lg hover:text-gray-900 hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:hover:text-white"
                    aria-label="Close Modal"
                >
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Modal Content */}
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                {/* Step Type and Step Name */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="step-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Enter type of work
                        </label>
                        <input
                            type="text"
                            id="step-name"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            placeholder="Enter the work type"
                            className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="assignee" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Assignee
                        </label>
                        <Select
                            options={employees.map((employee) => ({
                                value: employee.id,
                                label: employee.name,
                            }))}
                            value={selectedEmployeeOption} // Set the selected option
                            onInputChange={handleInputChange1}
                            onMenuScrollToBottom={handleMenuScrollToBottom1}
                            onChange={handleEmployeeChange}
                            isClearable
                            className="mt-2"
                            placeholder="Search and select an employee"
                            isLoading={loading1}
                        />
                    </div>
                </div>

                {/* Start Date and End Date */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Remarks */}
                <div>
                    <label htmlFor="remarks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Remarks
                    </label>
                    <textarea
                        id="remarks"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add any remarks..."
                        className="w-full p-2 text-sm bg-gray-50 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                    <Button
                        onClick={handleModalClose}
                        data-modal-hide="default-modal"
                        type="button"
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <button
                        type="submit"
                        className="text-white bg-[#433878] hover:bg-[#433878] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#433878] dark:hover:bg-[#433878] dark:focus:ring-[#433878]"
                    >
                        {selectedWorkPlan ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

        </div>
    );
}