import React from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';

export default function CalendarPage() {
  const { assignments, loading } = useCanvasAssignments();

  const today = new Date();
  const days = [...Array(14)].map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming Calendar</h1>

      {loading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
            <div key={day} className="text-sm font-semibold text-gray-600">{day}</div>
          ))}

          {days.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0];

            const dayAssignments = assignments.filter(a => {
              return a.due.toISOString().split('T')[0] === dateStr;
            });

            return (
              <div
                key={i}
                className="min-h-[90px] p-2 border rounded-2xl bg-gray-50 shadow-sm text-left"
              >
                <div className="text-xs font-bold text-gray-700">
                  {date.getDate()} {date.toLocaleString('default', { month: 'short' })}
                </div>

                {dayAssignments.map((a, j) => (
                  <div
                    key={j}
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
