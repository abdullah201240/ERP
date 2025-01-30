'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

interface FormData {
  id: number;
  projectName: string;
  totalArea: number | null;
  projectAddress: string;
  clientName: string;
  clientContact: string;
  projectId: string;
  termsCondition: string;
  signName: string;
  designation: string;
  subject: string;
  firstPera: string;
  secondPera: string;
  feesProposal: string;
  feesProposalNote1: string;
  feesProposalNote2: string;
  totalFees: number | null;
  inputPerSftFees: number | null;
  date: number | null;
}

const ReactEditor = dynamic(() => import('react-text-editor-kit'), { ssr: false });

export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id;
  const token = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState<FormData>({
    id: 0,
    projectName: '',
    totalArea: null,
    projectAddress: '',
    clientName: '',
    clientContact: '',
    projectId: '',
    termsCondition: '',
    signName: '',
    designation: '',
    subject: '',
    firstPera: '',
    secondPera: '',
    feesProposal: '',
    feesProposalNote1: '',
    feesProposalNote2: '',
    totalFees: null,
    inputPerSftFees: null,
    date: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!token) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${pageId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (!projectResponse.ok) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }
        const projectData = await projectResponse.json();
        setFormData((prev) => ({
          ...prev,
          ...projectData.data,
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [router, token, pageId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTotalFeesCalculation = (area: number | null, perSftFees: number | null) => {
    return area && perSftFees ? area * perSftFees : 0;
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArea = e.target.value ? parseFloat(e.target.value) : null;
    setFormData((prev) => {
      const updatedTotalFees = handleTotalFeesCalculation(newArea, prev.inputPerSftFees);
      return {
        ...prev,
        totalArea: newArea,
        totalFees: updatedTotalFees,
      };
    });
  };

 const handlePerSftFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPerSftFees = e.target.value ? parseFloat(e.target.value) : null;
    setFormData((prev) => {
      const updatedTotalFees = handleTotalFeesCalculation(prev.totalArea, newPerSftFees);
      return {
        ...prev,
        inputPerSftFees: newPerSftFees,
        totalFees: updatedTotalFees,
      };
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/degineBOQ/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error('Failed to update project');
        throw new Error('Failed to update project');
      }
      toast.success('Project updated successfully!');
      router.push('/design-boq'); // Redirect to the projects page after successful update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl mb-16">
      <h1 className="text-2xl text-black mb-6">Update BOQ</h1>
      <div className="bg-[#433878] p-8 rounded-xl">
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <p className="text-white">Fill-up all Information and create a update project successfully!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white mb-2">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}

                placeholder="Project Name"
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                disabled
                placeholder="Client Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Client Phone</label>
              <input
                type="tel"
                id="clientContact"
                name="clientContact"
                value={formData.clientContact}
                disabled
                placeholder="Client Phone"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Project Address</label>
              <input
                type="text"
                id="projectAddress"
                name="projectAddress"
                value={formData.projectAddress}
                disabled
                placeholder="Project Address"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Total Area</label>
              <input
                type="number"
                id="totalArea"
                name="totalArea"
                value={formData.totalArea || ''}
                onChange={handleAreaChange}
                placeholder="Total Area"
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>
            <div>
              <label className="text-white mb-2">Input Per Sft Fees</label>
              <input
                type="number"
                id="inputPerSftFees"
                name="inputPerSftFees"
                value={formData.inputPerSftFees || ''}
                onChange={handlePerSftFeesChange}
                placeholder="Input Per Sft Fees"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>
            <div>
              <label className="text-white mb-2">Total Fees</label>
              <input
                type="number"
                id="totalFees"
                name="totalFees"
                value={formData.totalFees || ''}
                disabled
                placeholder="Total Fees"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>


            <div>
              <label className="text-white mb-2">Sign Name</label>
              <input
                type="text"
                id="signName"
                name="signName"
                value={formData.signName}
                onChange={handleInputChange}
                placeholder="Sign Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Designation</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Designation"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">First Paragraph</label>
              <textarea
                id="firstPera"
                name="firstPera"
                value={formData.firstPera}
                onChange={handleInputChange}
                placeholder="First Paragraph"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Second Paragraph</label>
              <textarea
                id="secondPera"
                name="secondPera"
                value={formData.secondPera}
                onChange={handleInputChange}
                placeholder="Second Paragraph"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Fees Proposal</label>
              <textarea
                id="feesProposal"
                name="feesProposal"
                value={formData.feesProposal}
                onChange={handleInputChange}
                placeholder="Fees Proposal"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Fees Proposal Note 1</label>
              <textarea
                id="feesProposalNote1"
                name="feesProposalNote1"
                value={formData.feesProposalNote1}
                onChange={handleInputChange}
                placeholder="Fees Proposal Note 1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Fees Proposal Note 2</label>
              <textarea
                id="feesProposalNote2"
                name="feesProposalNote2"
                value={formData.feesProposalNote2}
                onChange={handleInputChange}
                placeholder="Fees Proposal Note 2"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            

           
            <div>
              <label className="text-white mb-2">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            {/* Terms & Conditions Editor */}
            <div className="col-span-full">
              <label className="text-white mb-2">Terms & Conditions</label>
              <ReactEditor
                value={formData.termsCondition || ""}
                onChange={(value: string) => {
                  setFormData({
                    ...formData,
                    termsCondition: value,
                  });
                }}
                mainProps={{ className: "black" }}
                placeholder="Terms & Condition"
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-full mt-6 p-2">
            <button
              type="submit"
              className="block w-full border border-white text-white font-bold py-3 px-4 rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
