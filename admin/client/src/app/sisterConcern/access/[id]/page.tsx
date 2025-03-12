'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

// Define an interface for access data
interface Access {
  id: number;
  employee_id: number;
  permission_id: number;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [accessData, setAccessData] = useState<Access[]>([]);

  const fetchCompanyProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessTokenCompany');
      if (!token) {
        router.push('/');
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}sisterConcern/auth/sisterConcern/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [router]);

  const fetchAccess = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessTokenCompany');
      if (!token) {
        router.push('/');
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}access/view-all/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json(); // Extract JSON data
      setAccessData(data.data || []); // Store API response in state

    } catch (error) {
      console.error('Error fetching access:', error);
    }
  }, [router, id]);

  useEffect(() => {
    const token = localStorage.getItem('accessTokenCompany');
    if (!token) {
      router.push('/'); // Redirect to login page if token doesn't exist
    } else {
      fetchCompanyProfile();
      fetchAccess();
    }
  }, [router, fetchCompanyProfile, fetchAccess]);

  async function postApi(permission_id: number) {
    const token = localStorage.getItem('accessTokenCompany');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}access/assign`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permission_id, employee_id: id }),
      }
    );
    if (response.ok) {
      await fetchAccess();
      toast.success('Permissions add successfully!');

    }
    if (!response.ok) {
      toast.error('Permissions not add!');

    }

  }

  async function deleteApi(permission_id: number) {
    try {
      const token = localStorage.getItem('accessTokenCompany');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}access/revoke/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permission_id, employee_id: id }),
      });

      if (response.ok) {
        toast.success('Permission removed successfully!');
        fetchAccess(); // Refresh access data after deletion
      } else {
        toast.error('Failed to remove permission!');
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
      toast.error('An error occurred while removing permission.');
    }
  }


  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>, id: number) {
    if (event.target.checked) {
      postApi(id);
    } else {
      deleteApi(id);
    }
  }
  function isChecked(permission_id: number) {
    return accessData.some((item) => item.permission_id === permission_id);
  }

  return (
    <div>
      <h1>All Access List</h1>
      <div className="bg-white mt-8 p-4 rounded-xl">
        <h1 className="bg-[#2A5158] text-white text-center p-4">Project Management Dashboard</h1>
        <Table className="w-full max-w-3xl mt-8">
          <TableBody>
            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb]">
                View Details
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(3)} onChange={(event) => handleCheckboxChange(event, 3)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb]">
                Update
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(1)} onChange={(event) => handleCheckboxChange(event, 1)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h1 className="bg-[#2A5158] text-white text-center p-4 mt-8">Site Visit Plan</h1>
        <Table className="w-full max-w-9xl mt-8">
          <TableBody>
            <TableRow>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Pre Project</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Project</TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Supervision</TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center border border-[#e5e7eb]">Create</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(4)} onChange={(event) => handleCheckboxChange(event, 4)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Create</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(8)} onChange={(event) => handleCheckboxChange(event, 8)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Create</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(12)} onChange={(event) => handleCheckboxChange(event, 12)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center border border-[#e5e7eb]">Details</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(5)} onChange={(event) => handleCheckboxChange(event, 5)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Details</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(9)} onChange={(event) => handleCheckboxChange(event, 9)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Details</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(13)} onChange={(event) => handleCheckboxChange(event, 13)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center border border-[#e5e7eb]">Update</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(6)} onChange={(event) => handleCheckboxChange(event, 6)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Update</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(10)} onChange={(event) => handleCheckboxChange(event, 10)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Update</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(14)} onChange={(event) => handleCheckboxChange(event, 14)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center border border-[#e5e7eb]">Delete</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(7)} onChange={(event) => handleCheckboxChange(event, 7)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Delete</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(11)} onChange={(event) => handleCheckboxChange(event, 11)} />
              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">Delete</TableCell>
              <TableCell className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(15)} onChange={(event) => handleCheckboxChange(event, 15)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>


        <h1 className="bg-[#2A5158] text-white text-center p-4 mt-12">Design & Development</h1>
        <Table className="w-full max-w-9xl mt-8">
          <TableBody>
            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Create Design Plan
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(16)} onChange={(event) => handleCheckboxChange(event, 16)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Service Package
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(20)} onChange={(event) => handleCheckboxChange(event, 20)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                BOQ & Quotation List
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(21)} onChange={(event) => handleCheckboxChange(event, 21)} />

              </TableCell>


            </TableRow>

            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Design Work & Update
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(18)} onChange={(event) => handleCheckboxChange(event, 18)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Generate BOQ & Quotation

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(22)} onChange={(event) => handleCheckboxChange(event, 22)} />


              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Generate Invoice

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(23)} onChange={(event) => handleCheckboxChange(event, 23)} />

              </TableCell>

            </TableRow>


            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Work Category
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(24)} onChange={(event) => handleCheckboxChange(event, 24)} />

              </TableCell>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Upload Working Drawing

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(25)} onChange={(event) => handleCheckboxChange(event, 25)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Materials

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(26)} onChange={(event) => handleCheckboxChange(event, 26)} />

              </TableCell>





            </TableRow>

            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Review Working Drawing BOQ
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(27)} onChange={(event) => handleCheckboxChange(event, 27)} />

              </TableCell>






            </TableRow>

          </TableBody>





        </Table>


        <h1 className="bg-[#2A5158] text-white text-center p-4 mt-12">Production</h1>
        <Table className="w-full max-w-9xl mt-8">
          <TableBody>
            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                BOQ Review
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(28)} onChange={(event) => handleCheckboxChange(event, 28)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Create Production Work Plan
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(29)} onChange={(event) => handleCheckboxChange(event, 29)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Production Work Update
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(30)} onChange={(event) => handleCheckboxChange(event, 30)} />

              </TableCell>


            </TableRow>

            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Received Materials
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(31)} onChange={(event) => handleCheckboxChange(event, 31)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Bill Generation
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(32)} onChange={(event) => handleCheckboxChange(event, 32)} />


              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">
                Project Handover

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(33)} onChange={(event) => handleCheckboxChange(event, 33)} />

              </TableCell>

            </TableRow>


            <TableRow>
              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">

                Project Handover
              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(34)} onChange={(event) => handleCheckboxChange(event, 34)} />

              </TableCell>

              <TableCell colSpan={1} className="text-center border border-[#e5e7eb] font-semibold">

                Manage Client Data

              </TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(35)} onChange={(event) => handleCheckboxChange(event, 35)} />

              </TableCell>



            </TableRow>





          </TableBody>





        </Table>
        <h1 className="bg-[#2A5158] text-white text-center p-4 mt-8">Purchase Req for Review</h1>
        <Table className="w-full max-w-9xl mt-8">
          <TableBody>
            <TableRow>


              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Purchase Req For Review</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(36)} onChange={(event) => handleCheckboxChange(event, 36)} />

              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Send Material</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(37)} onChange={(event) => handleCheckboxChange(event, 37)} />

              </TableCell>
            </TableRow>




          </TableBody>
        </Table>

        <h1 className="bg-[#2A5158] text-white text-center p-4 mt-8">Products</h1>
        <Table className="w-full max-w-9xl mt-8">
          <TableBody>
            <TableRow>


              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Category</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(38)} onChange={(event) => handleCheckboxChange(event, 38)} />

              </TableCell>
              <TableCell className="text-center border border-[#e5e7eb] font-semibold">Unit List</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(39)} onChange={(event) => handleCheckboxChange(event, 39)} />

              </TableCell>

              <TableCell className="text-center border border-[#e5e7eb] font-semibold">All Products</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(40)} onChange={(event) => handleCheckboxChange(event, 40)} />

              </TableCell>
              



            </TableRow>

            <TableRow>


              <TableCell className="text-center border border-[#e5e7eb] font-semibold">
                Approved Material List</TableCell>
              <TableCell colSpan={2} className="text-center border border-[#e5e7eb]">
                <input type="checkbox" checked={isChecked(41)} onChange={(event) => handleCheckboxChange(event, 41)} />

              </TableCell>




            </TableRow>




          </TableBody>
        </Table>





      </div>
    </div>
  );
}

