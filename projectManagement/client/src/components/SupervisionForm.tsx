import React from 'react'

export default function SupervisionForm() {
  return (
    <div>
         <div className="container mx-auto  max-w-6xl">
                <div className='bg-[#433878] p-8 rounded-xl'>

                    <form className="grid grid-cols-1 gap-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className='text-white mb-2'>Select a Project</label>
                                <select
                                    id="project"
                                    name="project"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                > 
                                    <option value="">Select a category</option>
                                    <option>Music</option>
                                    <option>Sports</option>
                                    <option>Arts</option>
                                    <option>Technology</option>
                                </select>
                            </div>
                            

                            <div>
                                <label className='text-white mb-2'>Assigned To</label>
                                <input
                                    type="text"
                                    id="assigned-to"
                                    name="assigned-to"
                                    placeholder="Assigned To   "
                                    className=" block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2 "
                                />
                            </div>


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
                                <label className='text-white mb-2'>Visit Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="visit-datetime"
                                    name="visit-datetime"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                />
                            </div>



                        </div>

                        <div>
                            <div>
                                <label className='text-white mb-2'>Project Details</label>
                                <textarea
                                    id="project-details"
                                    name="project-details"
                                    rows={3}
                                    placeholder="Project Details"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 bg-gray-100 mt-2"
                                ></textarea>
                            </div>

                        </div>

                        <div className="col-span-full mt-6 p-2">
                            <button
                                type="submit"
                                className="block w-full border border-white text-white font-bold py-3 px-4 rounded-full"
                            >
                                Create Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
      
    </div>
  )
}
