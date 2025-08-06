import React from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';

export default function CalendarPage() {
  const { assignments, loading, error } = useCanvasAssignments();
  const today = new Date();

  // Generate 28 days starting from Sunday of current week
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay()); // move to Sunday

  const days = [...Array(28)].map((_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📅 Upcoming Calendar</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : (
        <>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
              <div key={day} className="text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-4 text-left">
            {days.map((date, i) => {
              const dateStr = date.toDateString();
              const isToday = dateStr === new Date().toDateString();

              const dayAssignments = assignments
                .filter(a => a.due && a.due.toDateString() === dateStr)
                .sort((a, b) => a.due - b.due);

              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 rounded-2xl shadow-sm border transition
                    ${isToday ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200'}
                  `}
                >
                  {/* Date Header */}
                  <div className="text-xs font-bold text-gray-700 flex justify-between items-center mb-1">
                    <span>
                      {date.getDate()} {date.toLocaleString('default', { month: 'short' })}
                    </span>
                    {isToday && <span className="text-[10px] text-yellow-700 font-medium">Today</span>}
                  </div>

                  {/* Assignments */}
                  {dayAssignments.map((a, j) => (
                    <div
                      key={j}
                      className="mt-1 text-xs bg-blue-100 text-blue-800 rounded-xl px-2 py-1 truncate"
                      title={a.course ? `From ${a.course}` : ''}
                    >
                      {a.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
