import React, { useState } from 'react';

interface Holiday {
  date: string;
  reason: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([
    { date: '2025-03-17', reason: 'St. Patrick\'s Day' } // Example holiday
  ]);

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const findHoliday = (date: string): Holiday | undefined => {
    return holidays.find(holiday => holiday.date === date);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dateString = dayDate.toISOString().split('T')[0];
      const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      return { day: i + 1, dayOfWeek, dateString };
    });

    const blanks = Array.from({ length: firstDay }, () => null);

    return (
      <div className="grid grid-cols-7 gap-2">
        {blanks.map((_, i) => <div key={i} className="h-8 bg-gray-200"></div>)}
        {daysArray.map(({ day, dayOfWeek, dateString }) => {
          const holiday = findHoliday(dateString);
          const isHoliday = Boolean(holiday);
          return (
            <div key={day} className={`h-8 ${isHoliday ? 'bg-red-500' : 'bg-gray-100'} text-center`} onClick={() => alert(holiday ? holiday.reason : '')}>
              {`${dayOfWeek}, ${day}`} {/* Displaying day of the week and date */}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="px-4 py-2 rounded-lg bg-blue-500 text-white">
          Previous
        </button>
        <div className="font-bold text-xl">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </div>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="px-4 py-2 rounded-lg bg-blue-500 text-white">
          Next
        </button>
      </div>
      {renderCalendarDays()}
    </div>
  );
};

export default Calendar;