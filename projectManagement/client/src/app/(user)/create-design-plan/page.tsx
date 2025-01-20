import React from 'react'
import PreProjectPlanTable from '@/components/table/PreProjectPlanTable'
import CreateDesignPlanFrom from '@/components/CreateDesignPlanFrom'
export default function page() {
  return (
    <div className="bg-[#F1F2F3]  pl-0 mt-2  ">
        <h1 className="text-2xl  text-black">Create Design Plan</h1>

        <CreateDesignPlanFrom/>
        <h1 className="text-2xl  text-black mb-4 mt-4">        Pre Project Site Visit Plan        </h1>
        <div className="w-[98vw] md:w-full">
        <PreProjectPlanTable/>
      </div>
    </div>
  )
}
