'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@/app/assets/img/IQlogo.jpg';
import Footer from '@/app/assets/img/iqpv.jpg';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Define TypeScript interfaces
interface DesignInvoice {
    id: number;
    boqId: string;
    boqName: string;
    clientContact: string;
    clientName: string;
    nowPayAmount: string;
    projectAddress: string;
    subject: string;
    totalFees: string;
    totalArea: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

interface APIResponse {
    success: boolean;
    message: string;
    data: {
        designInvoice: DesignInvoice;
        totalPayAmount: number;
    };
    timestamp: string;
}

interface Project {
    id: number;
    serviceName: string;
    serviceDescription: string;
    serviceAmount: string;
}

interface DegineBOQ {
    id: number;
    projectName: string;
    clientName: string;
    clientContact: string;
    projectAddress: string;
    totalArea: string;
    inputPerSftFees: string;
    totalFees: string;
    termsCondition: string;
    signName: string;

    designation: string;
    projectId: string;
    subject: string;
    firstPera: string;
    secondPera: string;
    feesProposal: string;

    feesProposalNote1: string;
    feesProposalNote2: string;
    date: string;

}

export default function Home() {
    const router = useRouter();
    const { id } = useParams();
    const [boq, setBoq] = useState<DegineBOQ | null>(null);

    const [token, setToken] = useState<string | null>(null);
    const [invoiceData, setInvoiceData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loading1, setLoading1] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [error1, setError1] = useState<string | null>(null);
    const [loading3, setLoading3] = useState<boolean>(true);
    const [error3, setError3] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    // Get token after component mounts (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessToken');
            setToken(storedToken);
        }
    }, []);

    const fetchInvoiceBOQ = useCallback(async () => {
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineInvoiceById/${id}`, {
                headers: {
                    'Authorization': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data: APIResponse = await response.json();
            setInvoiceData(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [token, router, id]);

    useEffect(() => {
        if (token) {
            fetchInvoiceBOQ();
        }
    }, [token, fetchInvoiceBOQ]);

    const fetchProjects = useCallback(async () => {
        if (!token) {
            router.push('/');
            return;
        }



        const boqId = invoiceData?.data.designInvoice.boqId; // Extract boqId
        if(!boqId){
            return;
        }
        else{
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/degineBOQPart/${boqId}`, {
                    headers: {
                        'Authorization': token
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
    
                const data = await response.json();
    
                if (data.success && Array.isArray(data.data)) {
                    setProjects(data.data);
                } else {
                    throw new Error('Fetched data is not in expected format');
                }
            } catch (err) {
                setError1((err as Error).message);
            } finally {
                setLoading1(false);
            }

        }
        
    }, [token, router, invoiceData]); // Add invoiceData to the dependency array


    const fetchDegineBOQ = useCallback(async () => {
        if (!token) {
            router.push('/');
        } else {
            const boqId = invoiceData?.data.designInvoice.boqId; // Extract boqId
            console.log(boqId)
            try {
                if(!boqId){
                    return;
                }
                else{
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${boqId}`, {
                        headers: {
                            'Authorization': token
                        }
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to fetch projects');
                    }
    
                    const data = await response.json();
    
    
                    setBoq(data.data);
    

                }
                
            } catch (err) {
                setError3((err as Error).message);
            } finally {
                setLoading3(false);
            }
        }
    }, [token, router, invoiceData]);

    useEffect(() => {
        if (token) {
            fetchDegineBOQ()
            fetchProjects();
        }
    }, [token, fetchProjects, fetchDegineBOQ]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (loading3) return <div>Loading...</div>;
    if (error3) return <div>Error: {error3}</div>;


    if (loading1) return <div>Loading...</div>;
    if (error1) return <div>Error: {error1}</div>;
    if (!invoiceData || !invoiceData.data.designInvoice) return <div>No data found</div>;

    const { designInvoice, totalPayAmount } = invoiceData.data;
    const finalTotalAmount = projects.reduce((total, project) => {
        return total + parseFloat(project.serviceAmount || '0');
    }, 0);

    // CSS for printing
    const printStyles = `
        @page {
            size: A4;
            margin: 1cm; /* Adjust margins as needed */
        }

        @media print {
            body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }

            .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
                padding: 10px;
                background-color: #f17b21;
                z-index: 1000;
            }

            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100px; /* Adjust height as needed */
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white; /* Add background color if needed */
                z-index: 1000; /* Ensure footer is above other content */
            }

            .page-content {
                margin-top: 50px; /* Adjust based on header height */
                margin-bottom: 50px; /* Adjust based on footer height */
            }

            .print-break {
                page-break-after: always;
            }
        }
    `;

    return (
        <div>
            {/* <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Design Invoice</h2>
                <p><strong>ID:</strong> {designInvoice.id}</p>
                <p><strong>BOQ ID:</strong> {designInvoice.boqId}</p>
                <p><strong>BOQ Name:</strong> {designInvoice.boqName}</p>
                <p><strong>Client Name:</strong> {designInvoice.clientName}</p>
                <p><strong>Client Contact:</strong> {designInvoice.clientContact}</p>
                <p><strong>Now Pay Amount:</strong> {designInvoice.nowPayAmount} BDT</p>
                <p><strong>Total Fees:</strong> {designInvoice.totalFees} BDT</p>
                <p><strong>Total Area:</strong> {designInvoice.totalArea} sq. ft.</p>
                <p><strong>Project Address:</strong> {designInvoice.projectAddress}</p>
                <p><strong>Subject:</strong> {designInvoice.subject}</p>
                <p><strong>Date:</strong> {new Date(designInvoice.date).toLocaleString()}</p>
                <p><strong>Created At:</strong> {new Date(designInvoice.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(designInvoice.updatedAt).toLocaleString()}</p>
                <p><strong>Total Pay Amount:</strong> {totalPayAmount ?? 0} BDT</p>
            </div> */}

            <div id="pdf-content">
                <style>{printStyles}</style>
                <div className="header"></div>

                <div className="mt-4 page-content">
                    <div className="max-w-7xl mx-auto p-8 bg-white">
                        <div className="text-gray-800 mb-6">
                            <div className="mb-4">
                               
                                    <div className="flex justify-between items-start">
                                        <div className="w-2/3">
                                        <p className='mb-8'> <span className='font-semibold'> Invoice No :</span> {designInvoice.id} </p>
                                            <p>Date: {new Date(designInvoice.date).toLocaleDateString('en-CA')}</p>
                                            <p>To</p>
                                            <p>{designInvoice.clientName}</p>
                                            <p>{designInvoice.projectAddress}</p>
                                            <p><strong className='font-semibold'>Subject:</strong> {designInvoice.subject}</p>
                                        </div>
                                        <div className="w-1/3 flex justify-end">
                                            <Image
                                                src={Logo}
                                                alt="Logo"
                                                className="w-32 h-32 object-contain"
                                            />
                                        </div>
                                    </div>

                                    <Table className='mt-4'>
                                        <TableHeader className='bg-[#2A515B] text-white'>
                                            <TableRow className='text-center text-xs'>
                                                <TableHead className='text-white text-center'>SI. No.</TableHead>
                                                <TableHead className='text-white text-center'>Service</TableHead>
                                                <TableHead className='text-white text-center'>Description</TableHead>
                                                <TableHead className='text-white text-center'>Total Amount (Tk)</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {projects.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className='text-center border border-[#e5e7eb]'>
                                                        No Boq found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                projects.map((project, index) => (
                                                    <TableRow key={project.id} className='text-center text-xs'>
                                                        <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceName}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceDescription}</TableCell>
                                                        <TableCell className='border border-[#e5e7eb]'>{project.serviceAmount}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}

                                            <TableRow>
                                                <TableCell colSpan={3} className="text-right border border-[#e5e7eb]">
                                                    <strong>Total Amount:</strong>
                                                </TableCell>
                                                <TableCell className="text-right border border-[#e5e7eb]">
                                                    <strong>{finalTotalAmount.toFixed(2)} Tk</strong>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-right border border-[#e5e7eb]">
                                                    <strong>Till Date  Payment Made Amount:</strong>
                                                </TableCell>
                                                <TableCell className="text-right border border-[#e5e7eb]">
                                                    <strong>{totalPayAmount ?? 0} Tk</strong>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell colSpan={3} className="text-right border border-[#e5e7eb]">
                                                    <strong>Current Payment Amount:</strong>
                                                </TableCell>
                                                <TableCell className="text-right border border-[#e5e7eb]">
                                                    <strong>{designInvoice.nowPayAmount} Tk</strong>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell colSpan={3} className="text-right border border-[#e5e7eb]">
                                                    <strong>Due  Amount:</strong>
                                                </TableCell>
                                                <TableCell className="text-right border border-[#e5e7eb]">

                                                    <strong>




                                                        {(Number(designInvoice.totalFees) - (Number(totalPayAmount ?? 0) + Number(designInvoice.nowPayAmount ?? 0))


                                                        )}


                                                        Tk
                                                    </strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>


                               
                            </div>
                        </div>
                        <div className='pt-48'>



                            <div className="flex justify-between items-start w-full  ">
                                <div className="text-left">
                                    <hr className="w-32 border-t border-gray-400 mb-2" />
                                    <p className="font-bold">{boq?.signName}</p>
                                    <p className="text-sm">{boq?.designation}</p>
                                    <p className="text-sm">IQ Architects Ltd.</p>
                                </div>

                                <div className="text-right">
                                    <hr className="w-32 border-t border-gray-400 mb-2 ml-auto" />
                                    <p className="font-bold">{boq?.clientName}</p>
                                    <p className="text-sm">{boq?.projectAddress}</p>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>


                <div className="footer h-[100px] flex justify-center items-center">
                    <Image
                        src={Footer}
                        alt="Footer"
                        className="max-w-7xl w-full h-full object-contain"
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}