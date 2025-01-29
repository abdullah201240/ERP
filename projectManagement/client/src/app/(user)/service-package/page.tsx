'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface Service {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editService, setEditService] = useState<Service | null>(null); // To track the service being edited
  const [services, setServices] = useState<Service[]>([]); // Store fetched services
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // For adding new service
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For editing service
  const [newService, setNewService] = useState({ name: '', description: '' }); // Store form inputs for new service
  const [serviceNameError, setServiceNameError] = useState('');
  const [serviceDescriptionError, setServiceDescriptionError] = useState('');

  const [updatedService, setUpdatedService] = useState({ name: '', description: '' }); // Store form inputs for updating service
  const [updateServiceNameError, setUpdateServiceNameError] = useState('');
  const [updateServiceDescriptionError, setUpdateServiceDescriptionError] = useState('');

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/'); // Redirect to login if token is not found
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/services`, {
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        setServices(data.data); // Assuming the API returns { data: [...] }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchServices();
  }, [router]);

  // Handle service deletion
  const handleDelete = async () => {
    if (deleteId === null) return;
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/'); // Redirect to login if token is not found
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/services/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      // Remove the deleted service from the state
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== deleteId)
      );

      setDeleteId(null); // Reset deleteId
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle add service
  const handleAddService = async () => {
    if (!newService.name) {
      setServiceNameError('Service name is required');
    } else {
      setServiceNameError('');
    }

    if (!newService.description) {
      setServiceDescriptionError('Service description is required');
    } else {
      setServiceDescriptionError('');
    }

    // If there are validation errors, prevent submission
    if (!newService.name || !newService.description) return;

    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/'); // Redirect to login if token is not found
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error('Failed to add new service');
      }

      const data = await response.json();

      // Add the new service to the state
      setServices((prevServices) => [...prevServices, data.data]);

      // Reset form
      setNewService({ name: '', description: '' });

      // Close the modal
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle update service
  const handleUpdateService = async () => {
    if (!updatedService.name) {
      setUpdateServiceNameError('Service name is required');
    } else {
      setUpdateServiceNameError('');
    }

    if (!updatedService.description) {
      setUpdateServiceDescriptionError('Service description is required');
    } else {
      setUpdateServiceDescriptionError('');
    }

    // If there are validation errors, prevent submission
    if (!updatedService.name || !updatedService.description) return;

    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/'); // Redirect to login if token is not found
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/services/${editService?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(updatedService),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      const data = await response.json();

      // Update the service in the state
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === data.data.id ? data.data : service
        )
      );

      // Close the modal
      setIsEditModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="bg-[#F1F2F3] pl-0 mt-2">
        <h1 className="text-2xl text-black">Service Package</h1>

        <div className="bg-white mt-8 p-4 rounded-xl text-right">
          <Button
            className="bg-[#FF8319] text-white hover:bg-[#2A5158]"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New
          </Button>
        </div>

        <div className='mt-8 w-[98vw] md:w-full'>
          <Table>
            <TableHeader className="bg-[#2A515B] text-white">
              <TableRow className="text-center">
                <TableHead className="text-white text-center">Phase</TableHead>
                <TableHead className="text-white text-center">Service</TableHead>
                <TableHead className="text-white text-center">Description</TableHead>
                <TableHead className="text-white text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center border border-[#e5e7eb]">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service, index) => (
                  <TableRow key={service.id} className="text-center">
                    <TableCell className="text-center border border-[#e5e7eb]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border border-[#e5e7eb]">
                      {service.name}
                    </TableCell>
                    <TableCell className="border border-[#e5e7eb]">
                      {service.description}
                    </TableCell>
                    <TableCell className="border border-[#e5e7eb] text-3xl flex items-center justify-center">
                      <FaEdit
                        className="mr-8 opacity-50 cursor-pointer"
                        onClick={() => {
                          setEditService(service);
                          setUpdatedService({ name: service.name, description: service.description });
                          setIsEditModalOpen(true);
                        }}
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <RiDeleteBin6Line
                            className="opacity-50 cursor-pointer"
                            onClick={() => setDeleteId(service.id)} // Set service ID to delete
                          />
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Service Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this service? This action cannot be undone, and the service will be permanently removed from the system.
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
        </div>
      </div>

      {/* Add New Service Modal */}
      {isModalOpen && (
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Service</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div>
                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                {serviceNameError && <p className="text-red-500 text-sm">{serviceNameError}</p>}
              </div>

              <div>
                <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700">
                  Service Description
                </label>
                <textarea
                  id="serviceDescription"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
                />
                {serviceDescriptionError && <p className="text-red-500 text-sm">{serviceDescriptionError}</p>}
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsModalOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddService} className='bg-[#433878] hover:bg-[#2A5158]'>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && editService && (
        <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Service</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div>
                <label htmlFor="editServiceName" className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  id="editServiceName"
                  value={updatedService.name}
                  onChange={(e) => setUpdatedService({ ...updatedService, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                {updateServiceNameError && <p className="text-red-500 text-sm">{updateServiceNameError}</p>}
              </div>

              <div>
                <label htmlFor="editServiceDescription" className="block text-sm font-medium text-gray-700">
                  Service Description
                </label>
                <textarea
                  id="editServiceDescription"
                  value={updatedService.description}
                  onChange={(e) => setUpdatedService({ ...updatedService, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
                />
                {updateServiceDescriptionError && <p className="text-red-500 text-sm">{updateServiceDescriptionError}</p>}
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsEditModalOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateService} className='bg-[#433878] hover:bg-[#2A5158]'>Update</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
