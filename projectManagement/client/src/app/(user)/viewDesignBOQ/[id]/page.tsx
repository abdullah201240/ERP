'use client'
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Project {
  id: number;
  projectName: string;
  totalArea: number;
  projectAddress: string;
  clientName: string;
  clientContact: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  termsCondition: string;
  signName: string;
  designation: string;
  subject: string;
  firstPera: string;
  secondPera: string;
  feesProposal: string;
  feesProposalNote1: string;
  feesProposalNote2: string;
  totalFees: number;
  inputPerSftFees: number;
  date: number;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Ensure the `id` is used correctly or validated
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/'); // Redirect to login page if token doesn't exist
    } else {
      const fetchProject = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          console.log(data.data); // Log the response data
          setProject(data.data || null); // Set the project data
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [router, token, id]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen mt-2 ">
      <h1 className="text-2xl text-black mb-6">BOQ  Details</h1>

      {/* Project Title Section */}
      <div className="bg-teal-700 flex items-center p-4 rounded-lg mb-8 ">
        <Link href="/design-boq"> <FaArrowLeft className="text-white mr-3 text-2xl cursor-pointer" /></Link>
        <h1 className="text-2xl text-white ">{project.projectName || 'Loading...'}</h1>
      </div>

      {/* Main Content Section */}
      <div className="bg-white p-6 rounded-lg ">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Project Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">BOQ Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p><strong className='text-[#4472C4] pr-2'>Project Name:</strong> {project.projectName || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Date:</strong> {project.date || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Client Name:</strong> {project.clientName || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Client Contact:</strong> {project.clientContact || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Total Built-up Area:</strong> {project.totalArea || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Input Per Sft Fees:</strong> {project.inputPerSftFees || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Total Fees:</strong> {project.totalFees || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Sign Name:</strong> {project.signName || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Designation:</strong> {project.designation || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Subject:</strong> {project.subject || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>First Paragraph:</strong> {project.firstPera || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Second Paragraph:</strong> {project.secondPera || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Fees Proposal:</strong> {project.feesProposal || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Fees Proposal Note 1:</strong> {project.feesProposalNote1 || 'N/A'}</p>
            <p><strong className='text-[#4472C4] pr-2'>Fees Proposal Note 2:</strong> {project.feesProposalNote2 || 'N/A'}</p>

            <p><strong className='text-[#4472C4] pr-2'>Terms & Conditions:</strong> <div dangerouslySetInnerHTML={{ __html: project.termsCondition }} /></p>
            
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
          <Link href={`/editDesignBOQ/${id}`} className="flex justify-end items-center text-xl font-medium mt-12 text-[#868585]">
            <span className="mr-2"><FaEdit /></span>
            <span>Update</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
