import React from 'react'

export default function CreateDesignPlanFrom() {
  return (
    <div>
        <div className="container mx-auto max-w-6xl">
                <div className='bg-[#433878] p-8 rounded-xl'>

                    <form className="grid grid-cols-1 gap-6">

                       
                        <div>
                                <label className='text-white mb-2'>Select a Project then make a site visit plan</label>
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
                           

                            





                    </form>
                </div>
            </div>
      
    </div>
  )
}
