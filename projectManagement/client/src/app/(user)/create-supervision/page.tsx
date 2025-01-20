import SupervisionForm from '@/components/SupervisionForm'
import SupervisionTable from '@/components/table/SupervisionTable'
import React from 'react'

export default function page() {
  return (
    <div className="bg-[#F1F2F3]  pl-0 mt-2  ">
      <h1 className="text-2xl  text-black">Create Supervision Site Visit Plan</h1>
      <SupervisionForm />

      <h1 className="text-2xl  text-black mb-4 mt-4">  Supervision Site Visit Plan  </h1>
      <div className="w-[98vw] md:w-full">
      <SupervisionTable />
      </div>

    </div>
  )
}
