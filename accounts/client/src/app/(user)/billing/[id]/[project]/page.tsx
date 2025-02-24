'use client'
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toWords } from 'number-to-words';
// Dynamically import html2pdf from CDN


import dynamic from 'next/dynamic';
const ReactEditor = dynamic(() => import('react-text-editor-kit'), {
    ssr: false,
});
import Image from 'next/image';





interface Material {
    id: number;
    brand: string;
    brandModel: string;
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
    sisterConcernId: string;

}
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
    materialList: Material[];

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
    logo: string;
}


export default function Page() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params?.project;
    const [drawings, setDrawings] = useState<Drawing | null>(null);
    const [subject, setSubject] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [includeVAT, setIncludeVAT] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);

    const totalAmount = drawings?.materialList?.reduce((total, item) => {
        const itemTotalPrice = parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0");
        return total + itemTotalPrice;
    }, 0) || 0;
    const vatAmount = totalAmount * 0.075;  // 7.5% VAT
    const grandTotal = totalAmount + vatAmount;
    const grandTotalInWords = toWords(grandTotal).replace(/,/g, ''); // Clean commas if any
    const totalInWordsWithoutVAT = toWords(totalAmount).replace(/,/g, ''); // Total without VAT in words


    useEffect(() => {
        const checkTokenAndFetchProfile = async () => {
            const token = localStorage.getItem('accessTokenAccounts');
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
                const data = await response.json();
                if (data.success) {
                    setEmployeeDetails(data.data);
                    console.log(data.data)
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkTokenAndFetchProfile();
    }, [router]);


    useEffect(() => {
        const token = localStorage.getItem('accessTokenAccounts');

        if (!token) {
            router.push('/'); // Redirect to login page if token doesn't exist
        }
        console.log(employeeDetails)
    }, [router, employeeDetails]);


    const fetchDrawings = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessTokenAccounts');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_PROJECTMANAGEMENT}workingDrawing/drawing/${id}`, {
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error("Failed to fetch drawings");
            const data = await response.json();

            setDrawings(data.data || null);
        } catch (error) {
            console.error("Error fetching drawings:", error);
            setDrawings(null);
        }
    }, [router, id]);





    useEffect(() => {
        fetchDrawings();
    }, [fetchDrawings]);

    useEffect(() => {
        const drawingsParam = searchParams.get('drawings');
        const subjectParam = searchParams.get('subject');
        const termsConditionParam = searchParams.get('termsCondition');
        const includeVATParam = searchParams.get('includeVAT');
        const employeeDetailsParam = searchParams.get('employeeDetails');

        if (drawingsParam) {
            setDrawings(JSON.parse(drawingsParam));
        }
        if (subjectParam) {
            setSubject(subjectParam);
        }
        if (termsConditionParam) {
            setTermsCondition(termsConditionParam);
        }
        if (includeVATParam) {
            setIncludeVAT(includeVATParam === 'true');
        }
        if (employeeDetailsParam) {
            setEmployeeDetails(JSON.parse(employeeDetailsParam));
        }
    }, [searchParams]);

    const handleViewClick = () => {
        const queryParams = new URLSearchParams({
            drawings: JSON.stringify(drawings),
            subject: subject,
            termsCondition: termsCondition,
            includeVAT: includeVAT.toString(),
            employeeDetails: JSON.stringify(employeeDetails),
        }).toString();

        window.open(`/print/bill?${queryParams}`, '_blank');
    };




    return (

        <div className="p-2 md:p-5" >
            <div className="bg-white p-4 md:p-12 shadow rounded ">
                <form className="grid grid-cols-1 gap-6 ">


                    <p>Application Part</p>

                    <div>
                        <label htmlFor="subject" className="block mb-2 text-black font-medium">
                            Subject
                        </label>
                        <input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="block w-full rounded-md border border-black shadow-sm p-2 bg-white mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter subject"
                        />
                    </div>

                    {/* Terms & Condition Editor */}
                    <div className="mb-6">
                        <label htmlFor="termsCondition" className="block text-black font-medium mb-2">
                            Terms & Condition
                        </label>
                        <div>
                            <ReactEditor
                                value={termsCondition || ""}
                                onChange={(value) => setTermsCondition(value)}
                                mainProps={{ className: "border border-black rounded-md p-2" }}
                                placeholder="Enter terms and conditions"
                                className="w-full"
                            />
                        </div>
                    </div>
                    {/* VAT Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="vatCheckbox"
                            checked={includeVAT}
                            onChange={(e) => setIncludeVAT(e.target.checked)}

                            className="w-4 h-4 text-blue-600 border border-black rounded focus:ring-blue-500"
                        />
                        <label htmlFor="vatCheckbox" className="ml-2 text-black font-medium">
                            Total VAT @ 7.5%
                        </label>
                    </div>
                </form>
                <button
                    onClick={handleViewClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                >
                    Print
                </button>

            </div>


            <div id="printable-content" className='mt-12' >
                <div className="bg-white p-4 md:p-12 shadow rounded">
                    <div className="flex justify-end mt-12">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL_ADMIN}uploads/${employeeDetails?.logo}`}
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </div>
                    <p> Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} </p>
                    <p>To</p>
                    <p>{drawings?.clientName || "No Client Name"}</p>
                    <p>{drawings?.projectAddress || "No Project Address"}</p>
                    <p className='mt-8'>Subject: {subject} </p>


                    <Table className='mt-12'>
                        <TableHeader className='bg-[#2A515B] text-white'>
                            <TableRow className='text-center'>
                                <TableHead className='text-white text-center'>SI. No.</TableHead>
                                <TableHead className='text-white text-center'>DESCRIPTION OF ITEMS</TableHead>
                                <TableHead className='text-white text-center'>Total Amount
                                    (Tk)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='text-center border border-[#e5e7eb]'>1</TableCell>
                                <TableCell className='text-center border border-[#e5e7eb]'>{drawings?.category}</TableCell>

                                <TableCell className='text-center border border-[#e5e7eb]'>{drawings?.materialList?.reduce((total, item) => {
                                    const itemTotalPrice = parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0");
                                    return total + itemTotalPrice;
                                }, 0).toFixed(2) || 0}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Total Amount
                                    in Tk.
                                </TableCell>
                                <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{drawings?.materialList?.reduce((total, item) => {
                                    const itemTotalPrice = parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0");
                                    return total + itemTotalPrice;
                                }, 0).toFixed(2) || 0}</TableCell>



                            </TableRow>
                            {includeVAT && (
                                <TableRow>
                                    <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>VAT @ 7.5%</TableCell>
                                    <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{vatAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            )}

                            {includeVAT && (
                                <TableRow>
                                    <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Grand Total in Tk.</TableCell>
                                    <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{grandTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            )}
                            {!includeVAT && (
                                <TableRow>
                                    <TableCell colSpan={2} className='text-right border border-[#e5e7eb]'>Grand Total in Tk.</TableCell>
                                    <TableCell colSpan={3} className='text-center border border-[#e5e7eb]'>{totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {!includeVAT && (
                        <div className="mt-8 text-left">
                            <p className="font-semibold">In-words : {totalInWordsWithoutVAT}</p>
                        </div>

                    )}

                    {includeVAT && (
                        <div className="mt-8 text-left">
                            <p className="font-semibold">In-words : {grandTotalInWords}</p>
                        </div>

                    )}

                    <p className='mt-12 font-semibold'>Terms & Conditions:</p>
                    <div className="terms-condition mt-4 p-4 border rounded-md bg-gray-100">
                        {/* Render the terms condition content here */}
                        <div dangerouslySetInnerHTML={{ __html: termsCondition }} />
                    </div>
                    {/* Material Information Table */}
                    <Table className='mt-12'>
                        <TableHeader className='bg-[#2A515B] text-white'>
                            <TableRow className='text-center'>
                                <TableHead className='text-white text-center'>SI. No.</TableHead>
                                <TableHead className='text-white text-center'>Items</TableHead>


                                <TableHead className='text-white text-center'>Brand Model</TableHead>
                                <TableHead className='text-white text-center'>Quantity</TableHead>
                                <TableHead className='text-white text-center'>Unit</TableHead>
                                <TableHead className='text-white text-center'>Price (Tk)</TableHead>
                                <TableHead className="text-white text-center">Total Price (Tk)</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drawings?.materialList?.map((item, index) => {
                                const totalPrice = parseFloat(item.mrpPrice || "0") * (parseFloat(item.itemQuantity || "0"));
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-center border border-[#e5e7eb]">{index + 1}</TableCell>
                                        <TableCell className="text-center border border-[#e5e7eb]">{item.productName}</TableCell>

                                        <TableCell className="text-center border border-[#e5e7eb]">{item.brandModel}</TableCell>                                        <TableCell className="text-center border border-[#e5e7eb]">{item.itemQuantity}</TableCell>

                                        <TableCell className="text-center border border-[#e5e7eb]">{item.unit}</TableCell>
                                        <TableCell className="text-center border border-[#e5e7eb]">{item.mrpPrice}</TableCell>
                                        <TableCell className="text-center border border-[#e5e7eb]">{totalPrice.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {/* Add the total row at the bottom of the table */}
                            <TableRow>
                                <TableCell colSpan={6} className="text-right border border-[#e5e7eb]">Total Amount</TableCell>
                                <TableCell className="text-center border border-[#e5e7eb]">
                                    {drawings?.materialList?.reduce((total, item) => total + (parseFloat(item.mrpPrice || "0") * parseFloat(item.itemQuantity || "0")), 0).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>




            </div>



        </div>


    );
}
