// components/GanttChart.tsx
'use client'; // Mark this as a client-side component

import dynamic from 'next/dynamic';
import React from 'react';

const GanttComponent = dynamic(() => import('@syncfusion/ej2-react-gantt').then(mod => mod.GanttComponent), { ssr: false });

const GanttChart = ({ data, taskSettings }) => {
    return (
        <GanttComponent dataSource={data} treeColumnIndex={1} taskFields={taskSettings}></GanttComponent>
    );
};

export default GanttChart;
