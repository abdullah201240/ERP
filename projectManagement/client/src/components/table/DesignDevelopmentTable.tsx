import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,

} from "@/components/ui/table"

import Link from 'next/link'
export default function DesignDevelopmentTable() {
    return ( 
        <div>
            <Table   >

                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow>
                        <TableHead className='text-white'>SI.
                            No.</TableHead>
                        <TableHead className='text-white'>Project
                            Name</TableHead>
                       
                       
                        <TableHead className='text-white'>Assigned
                            To</TableHead>

                        <TableHead className='text-white'>Supervisor
                            Name</TableHead>
                        <TableHead className='text-white'>Current
                            Stage</TableHead>
                        <TableHead className='text-white'>Start Date</TableHead>
                        
                        <TableHead className='text-white'>Project
                            Timeline</TableHead>
                        <TableHead className='text-white'>Days
                            Passed</TableHead>
                        <TableHead className='text-white'>Days
                            Remaining</TableHead>
                        <TableHead className='text-white'>Current work
                            in progress</TableHead>
                        <TableHead className='text-white'>Remaining
                            Tasks</TableHead>
                        <TableHead className='text-white'>Completion
                            (%)</TableHead>
                        <TableHead className='text-white'>View
                            Details</TableHead>


                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell >1</TableCell>
                        
                        <TableCell>Nrtyfugihojpk[l] tryguihojpk[l] yuiopk[l]; tyuihojpk[l ghjkjl</TableCell>
                        <TableCell>H</TableCell>
                        <TableCell>Design
                            Development</TableCell>
                        <TableCell>9/1/2024</TableCell>
                        <TableCell>####</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>36</TableCell>
                        <TableCell>9</TableCell>
                        <TableCell>3d design
                            development </TableCell>
                        <TableCell>3D Design
                            Rendering</TableCell>
                        <TableCell>65%</TableCell>
                        <TableCell>
                            <Link  href="/projects/1" className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                View
                            </Link>


                        </TableCell>

                    </TableRow>
                    <TableRow className='bg-[#F4F4F4]'>
                        <TableCell >1</TableCell>
                       
                        <TableCell>N</TableCell>
                        <TableCell>H</TableCell>
                        <TableCell>Design
                            Development</TableCell>
                        <TableCell>9/1/2024</TableCell>
                        <TableCell>####</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>36</TableCell>
                        <TableCell>9</TableCell>
                        <TableCell>3d design
                            development </TableCell>
                        <TableCell>3D Design
                            Rendering</TableCell>
                        <TableCell>65%</TableCell>
                        <TableCell>
                            <Link href="/projects/1" className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                View
                            </Link>


                        </TableCell>

                    </TableRow>
                </TableBody>
            </Table>


        </div>
    )
}
