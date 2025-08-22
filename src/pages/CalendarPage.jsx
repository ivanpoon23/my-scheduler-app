import React, { useState } from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';

export default function CalendarPage() {
  const [filter, setFilter] = useState('unsubmitted'); // 'unsubmitted' | 'all'
  const onlyUnsubmitted = filter === 'unsubmitted';

  const { data: assignments = [], isLoading, error } = useCanvasAssignments({ onlyUnsubmitted });

  const today = new Date();

  // Create a 28-day calendar starting from today
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Filter assignments for local filtering if needed (extra safety)
  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true;
    return !a.submission || !a.has_submitted_submissions;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Upcoming Calendar</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm text-gray-700"
        >
          <option value="unsubmitted">Unsubmitted Only</option>
          <option value="all">All Assignments</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : error ? (
        <p className="text-red-500">{error.message}</p>
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center">
          {/* Day Headers */}
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
            <div key={day} className="text-sm font-semibold text-gray-600">{day}</div>
          ))}

          {/* Calendar Cells */}
          {days.map((date) => {
            const dateStr = date.toDateString();
            const isToday = dateStr === new Date().toDateString();

            const dayAssignments = filteredAssignments.filter((a) => 
              a.due && new Date(a.due).toDateString() === dateStr
            );

            return (
              <div
                key={dateStr}
                className={`min-h-[90px] p-2 rounded-2xl shadow-sm text-left border transition
                  ${isToday ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50 border-gray-200'}
                `}
              >
                <div className="text-xs font-bold text-gray-700 flex justify-between items-center">
                  <span>
                    {date.getDate()} {date.toLocaleString('default', { month: 'short' })}
                  </span>
                  {isToday && <span className="text-[10px] text-yellow-700 font-medium">Today</span>}
                </div>

                {dayAssignments.map((a) => (
                  <div
                    key={`${a.id}_${a.course}`} // unique key for React
                    className="mt-1 text-xs bg-blue-100 text-blue-800 rounded px-2 py-1"
                  >
                    {a.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
