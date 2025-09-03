import React, { useState } from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';
import { CalendarDays } from 'lucide-react';

export default function ToDoPage() {
  const [filter, setFilter] = useState('unsubmitted'); // "unsubmitted" | "all"
  const onlyUnsubmitted = filter === 'unsubmitted';

  const { data: assignments = [], isLoading, error } = useCanvasAssignments({ onlyUnsubmitted });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <CalendarDays className="text-blue-600" />
        To-Do List
      </h1>

      {/* Filter buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('unsubmitted')}
          className={`px-3 py-1 rounded ${
            filter === 'unsubmitted' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Unsubmitted
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All Upcoming
        </button>
      </div>

      {/* Loading / Error / Empty / List */}
      {isLoading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : error ? (
        <p className="text-red-500">{error.message}</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500">You're all caught up! 🎉</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((item, index) => (
            <li
              key={`${item.course}_${item.id}_${index}`} // ✅ unique key
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-500">
                  Due:{' '}
                  {item.due ? (
                    <span className="text-blue-600 font-medium">
                      {new Date(item.due).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">No due date</span>
                  )}
                </p>
                {item.has_submitted_submissions && (
                  <p className="text-xs text-green-600 mt-1">Submitted ✅</p>
                )}
              </div>
              <div className="text-sm text-gray-500">{item.course}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
