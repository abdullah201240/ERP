import React, { forwardRef } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { toWords } from 'number-to-words';

// Interface as provided by you
interface DegineBOQPart {
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

interface PrintBoqProps {
    boq: DegineBOQ | null;
    projects: DegineBOQPart[];
    finalAmount: number;
}

const PrintBoq = forwardRef<HTMLDivElement, PrintBoqProps>(({ boq, projects, finalAmount }, ref) => {
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

    return (
        <div ref={ref} className="mt-12">
            <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
                {/* Sender's Address */}
                <div className="text-gray-800 mb-6">
                    {boq ? (
                        <div className="mb-4">
                            <p>{formatDate(boq.date)}</p>
                            <p>To</p>
                            <p>{boq.clientName}</p>
                            <p>{boq.projectAddress}</p>
                            <p><strong className='font-semibold'>Subject:</strong> {boq.subject}</p>
                            <p className='mt-8'>Dear Sir,</p>
                            <p className='mt-4'>{boq.firstPera}</p>
                            <p className='mt-4'>{boq.secondPera}</p>
                            <p className='font-semibold mt-4'><u>SCOPE OF WORKS:</u></p>

                            {projects && projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <p key={index}>PHASE-{index + 1}: <span>{project.serviceName}</span></p>
                                ))
                            ) : (
                                <p>No projects available</p>
                            )}

                            <p className='mt-8 font-semibold'>FEES PROPOSAL:</p>
                            <p className='mt-2'>{boq.feesProposal}</p>
                            <Table className='mt-8'>
                                <TableHeader className='bg-[#2A515B] text-white'>
                                    <TableRow className='text-center'>
                                        <TableHead className='text-white text-center'>Item No.</TableHead>
                                        <TableHead className='text-white text-center'>Description</TableHead>
                                        <TableHead className='text-white text-center'>Total Built-up Area in sft.</TableHead>
                                        <TableHead className='text-white text-center'>Total Fees in Tk.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className='text-center border border-[#e5e7eb]'>1</TableCell>
                                        <TableCell className='text-center border border-[#e5e7eb]'>
                                            <p className='font-semibold mt-4 text-left'>Service Package:</p>
                                            {projects && projects.length > 0 ? (
                                                projects.map((project, index) => (
                                                    <p className='text-left' key={index}>PHASE-{index + 1}: <span>{project.serviceName}</span></p>
                                                ))
                                            ) : (
                                                <p>No projects available</p>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-center border border-[#e5e7eb]'>{boq.totalArea}</TableCell>
                                        <TableCell className='text-center border border-[#e5e7eb]'>{boq.totalFees}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <p className='text-sm mt-4'>
                                <span className='font-semibold'>In-words:</span> {boq.totalFees ? toWords(boq.totalFees) : 'N/A'}
                            </p>
                            <p className='text-xm font-semibold mt-4'>Mode of Payment:</p>

                            <Table className='mt-4'>
                                <TableHeader className='bg-[#2A515B] text-white'>
                                    <TableRow className='text-center'>
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
                                            <TableRow key={project.id} className='text-center'>
                                                <TableCell className='text-center border border-[#e5e7eb]'>{index + 1}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{project.serviceName}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{project.serviceDescription}</TableCell>
                                                <TableCell className='border border-[#e5e7eb]'>{project.serviceAmount}</TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right border border-[#e5e7eb]">
                                            <strong>Total Amount in Tk.</strong>
                                            <strong>{finalAmount.toFixed(2)} Tk</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <p className='text-sm mt-4'>
                                <span className='font-semibold'>In-words:</span> {finalAmount.toFixed(2) ? toWords(finalAmount.toFixed(2)) : 'N/A'}
                            </p>

                            <p className='font-semibold mt-4 mb-4'>Note 01</p>
                            <p className='mt-4 mb-4'>{boq.feesProposalNote1}</p>
                            <p className='font-semibold mt-4 mb-4'>Note 02</p>
                            <p className='mt-4 mb-4'>{boq.feesProposalNote2}</p>

                            <p className='font-semibold mt-4 mb-4'>Terms & Condition:</p>
                            <div className='ml-4' dangerouslySetInnerHTML={{ __html: boq.termsCondition }} />

                            <p className='font-semibold mt-4 mb-36'>Thanking You</p>

                            <div className="flex justify-between items-start w-full">
                                <div className="text-left">
                                    <hr className="w-32 border-t border-gray-400 mb-2" />
                                    <p className="font-bold">{boq.signName}</p>
                                    <p className="text-sm">{boq.designation}</p>
                                    <p className="text-sm">IQ Architects Ltd.</p>
                                </div>

                                <div className="text-right">
                                    <hr className="w-32 border-t border-gray-400 mb-2 ml-auto" />
                                    <p className="font-bold">{boq.clientName}</p>
                                    <p className="text-sm">{boq.projectAddress}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No Data Found</p>
                    )}
                </div>
            </div>
        </div>
    );
});

PrintBoq.displayName = 'PrintBoq'; // Optional: Set display name for debugging

export default PrintBoq;