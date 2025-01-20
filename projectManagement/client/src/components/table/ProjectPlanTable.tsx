import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,

} from "@/components/ui/table"
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export default function ProjectPlanTable() {
    return (
        <div>
            <Table   >

                <TableHeader className='bg-[#2A515B] text-white'>
                    <TableRow>
                        <TableHead className='text-white'>Delete</TableHead>
                        <TableHead className='text-white'>Project Name</TableHead>
                        <TableHead className='text-white'>Project Address</TableHead>
                        <TableHead className='text-white'>Assigned To</TableHead>
                        <TableHead className='text-white'>Visit Date & Time</TableHead>
                        <TableHead className='text-white'>Project Details</TableHead>

                        <TableHead className='text-white'>Update </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className='text-3xl' ><MdDelete /></TableCell>

                        <TableCell >1</TableCell>

                        <TableCell>N</TableCell>
                        <TableCell>H</TableCell>
                        <TableCell>H</TableCell>
                        <TableCell>Design
                            Development</TableCell>
                            <TableCell className='text-3xl' ><FaEdit /></TableCell>


                    </TableRow>
                    <TableRow className='bg-[#F4F4F4]'>
                    <TableCell className='text-3xl' ><MdDelete /></TableCell>

                        <TableCell >2</TableCell>

                        <TableCell>N</TableCell>
                        <TableCell>H</TableCell>
                        <TableCell>Design
                            Development</TableCell>
                            <TableCell>Design
                            Development</TableCell>
                            <TableCell className='text-3xl' ><FaEdit /></TableCell>


                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}
