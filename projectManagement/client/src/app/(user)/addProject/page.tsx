import React from 'react';

export default function Page() {
  return (
    <div>
      <div className="container mx-auto max-w-6xl mb-12">
        <h1 className="text-2xl  text-black mb-6">Add a Project</h1>
        <div className='bg-[#433878] p-8 rounded-xl'>

          <form className="grid grid-cols-1 gap-6" action="/dashboard">
            <p className='text-white'>Fill-up all Information and create a new project successfully! </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Project Type</label>
                <select
                  id="project-type"
                  name="project-type"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                >
                  <option value="">Select a project type</option>
                  <option>Low</option>
                  <option>Standard</option>
                  <option>Premium</option>
                </select>
              </div>

              <div>
                <label className='text-white mb-2'>Project Name</label>
                <input
                  type="text"
                  id="project-name"
                  name="project-name"
                  placeholder="Project Name"
                  className=" block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2 "
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <div>
                <label className='text-white mb-2'>Total Built-up Area (sft)</label>
                <input
                  type="number"
                  id="built-up-area"
                  name="built-up-area"
                  placeholder="Total Built-up Area"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Client Name</label>
                <input
                  type="text"
                  id="client-name"
                  name="client-name"
                  placeholder="Client Name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Project Address</label>
                <input
                  type="text"
                  id="project-address"
                  name="project-address"
                  placeholder="Project Address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>
              <div>
                <label className='text-white mb-2'>Client Address</label>
                <input
                  type="text"
                  id="client-address"
                  name="client-address"
                  placeholder="Client Address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='text-white mb-2'>Client Contact</label>
                <input
                  type="text"
                  id="client-contact"
                  name="client-contact"
                  placeholder="Client Contact"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Client Email</label>
                <input
                  type="email"
                  id="client-email"
                  name="client-email"
                  placeholder="Client Email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Creator Name </label>
                <input
                  type="text"
                  id="creator-name"
                  name="creator-name"
                  disabled
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>

              <div>
                <label className='text-white mb-2'>Creator Email</label>
                <input
                  type="email"
                  id="creator-email"
                  name="creator-email"
                  disabled
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                />
              </div>




            </div>

            <div>
              <div>
                <label className='text-white mb-2'>Requirement Details</label>
                <textarea
                  id="requirement-details"
                  name="requirement-details"
                  rows={3}
                  placeholder="Requirement Details"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                ></textarea>
              </div>

            </div>

            <div className="col-span-full mt-6 p-2">
              <button
                type="submit"
                className="block w-full border border-white text-white font-bold py-3 px-4 rounded-full"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
