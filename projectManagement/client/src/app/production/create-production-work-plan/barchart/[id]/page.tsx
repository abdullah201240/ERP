// 'use client'

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle, BarProps } from 'recharts';
// import dayjs from 'dayjs';

// // Define the type for a task item
// interface Task {
//     name: string;
//     startDate: string;
//     endDate: string;
//     start: number;
//     duration: number;
// }

// // Define the type for the tooltip props
// interface TooltipProps {
//     active?: boolean;
//     payload?: { payload: Task }[];
// }

// // Task list with start and end dates
// const data: Omit<Task, 'start' | 'duration'>[] = [
//     { name: "Channel Preparation", startDate: "2025-02-12", endDate: "2025-02-14" },
//     { name: "Glass Fitting", startDate: "2025-02-15", endDate: "2025-02-18" },
//     { name: "Frosted Paper", startDate: "2025-02-19", endDate: "2025-02-20" },
//     { name: "Glass Door Installation", startDate: "2025-02-21", endDate: "2025-02-25" },
//     { name: "Lounge TV Wall Panelling", startDate: "2025-02-26", endDate: "2025-03-02" },
//     { name: "Carpet Supply & Installation", startDate: "2025-03-05", endDate: "2025-03-10" }
// ];

// // Determine the full calendar range
// const startDate = dayjs("2025-02-12"); // Earliest task start
// const endDate = dayjs("2025-03-10");   // Latest task end

// // Generate a list of all dates in the range
// const allDates: string[] = [];
// for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate, 'day'); d = d.add(1, 'day')) {
//     allDates.push(d.format("YYYY-MM-DD"));
// }

// // Convert task data for recharts (adding correct start offset)
// const formattedData: Task[] = data.map(item => ({
//     ...item,
//     start: dayjs(item.startDate).diff(startDate, 'day'), // Correct start position based on real calendar
//     duration: dayjs(item.endDate).diff(dayjs(item.startDate), 'day') + 1 // Duration in days
// }));

// // Custom Tooltip to show readable date range
// const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//         const task = payload[0].payload;
//         return (
//             <div className="bg-white p-2 border rounded shadow">
//                 <p className="font-bold">{task.name}</p>
//                 <p>{`Start: ${dayjs(task.startDate).format("DD/MM/YYYY")}`}</p>
//                 <p>{`End: ${dayjs(task.endDate).format("DD/MM/YYYY")}`}</p>
//             </div>
//         );
//     }
//     return null;
// };

// // Custom shape for the bar with proper type for props
// const CustomBarShape = (props: BarProps) => {
//     const { x, y, width, height, payload } = props as any;  // Cast to any for payload

//     // Calculate width based on the task's duration and the total calendar days
//     const barWidth = width * (payload.duration / allDates.length);
//     const barX = x + (payload.start * (width / allDates.length));
//     return (
//         <Rectangle
//             x={barX}
//             y={y}
//             width={barWidth}
//             height={height}
//             fill="#2F4F4F"
//             radius={[5, 5, 5, 5]} // Round the corners
//         />
//     );
// };

// export default function Page() {
//     return (
//         <div className="p-2 md:p-5">
//             <h1 className="text-2xl font-bold mb-4">Gantt Chart (Accurate Calendar Display)</h1>

//             <ResponsiveContainer width="100%" height={400}>
//                 <BarChart
//                     layout="vertical"
//                     data={formattedData}
//                     margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                         type="number"
//                         domain={[0, allDates.length - 1]}
//                         tickFormatter={(index) => dayjs(startDate).add(index, 'day').format("DD/MM")}
//                     />
//                     <YAxis dataKey="name" type="category" />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar
//                         dataKey="duration"
//                         stackId="a"
//                         fill="#2F4F4F"
//                         barSize={20}
//                         shape={<CustomBarShape />} // Use the custom shape here
//                     />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// }


// src/app/production/create-production-work-plan/barchart/[id]/page.tsx
import React from 'react';
import '@/app/globals.css';
import GanttChart from '@/components/GanttChart';

export default function Page() {
    const data = [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
            ]
        },
        {
            TaskID: 5,
            TaskName: 'Project Estimation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
            ]
        }
    ];

    const taskSettings = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        child: 'subtasks'
    };

    return (
        <div>
            {/* Use the GanttChart component */}
            <GanttChart data={data} taskSettings={taskSettings} />
        </div>
    );
}
