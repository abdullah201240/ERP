'use client'
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface FormData {
  id: number;
  projectId: string;
  itemName: string;
  brandModel: string;
  itemQuantity: string;
  itemDescription: string;
  unit: string;
  category: string;
  clientName: string;
  clientContact: string;
  projectAddress: string;
  projectName: string;
  images: Array<{ id: number; imageName: string }>;
}

interface Category {
  id: number;
  name: string;
}

export default function UpdateProjectPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id;
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<FormData>({
    id: 0,
    projectId: '',
    itemName: '',
    brandModel: '',
    itemQuantity: '',
    itemDescription: '',
    unit: '',
    category: '',
    clientName: '',
    clientContact: '',
    projectAddress: '',
    projectName: '',
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          router.push('/'); // Redirect to login page if token doesn't exist
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing/${pageId}`, {
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
  }, [router, pageId]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/'); // Redirect to login page if token doesn't exist
        return;
      }
      console.log(JSON.stringify(formData))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}workingDrawing/drawing/${pageId}`, {
        method: 'PUT',
        headers: {
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
      <h1 className="text-2xl text-black mb-6">Update woking Drawing</h1>
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
              <label className="text-white mb-2">Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="Item Name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Brand Model</label>
              <input
                type="text"
                id="brandModel"
                name="brandModel"
                value={formData.brandModel}
                onChange={handleInputChange}
                placeholder="Brand Model"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Item Quantity</label>
              <input
                type="text"
                id="itemQuantity"
                name="itemQuantity"
                value={formData.itemQuantity}
                onChange={handleInputChange}
                placeholder="Item Quantity"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Item Description</label>
              <textarea
                id="itemDescription"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                placeholder="Item Description"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="Unit"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              />
            </div>

            <div>
              <label className="text-white mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Images Section */}
            <div className="col-span-full">
              <label className="text-white mb-2">Images</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.images.map((image) => (
                  <div key={image.id} className="relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${image.imageName}`}
                      alt={`Image ${image.id}`}
                      width={100}
                      height={100}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
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