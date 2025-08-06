import React from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';
import { CalendarDays } from 'lucide-react'; // optional icon

export default function ToDoPage() {
  const { assignments, loading } = useCanvasAssignments();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <CalendarDays className="text-blue-600" />
        To-Do List
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500">You're all caught up! 🎉</p>
      ) : (
        <ul className="space-y-4">
          {assignments.map((item, i) => (
            <li
              key={i}
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-500">
                  Due:{" "}
                  <span className="text-blue-600 font-medium">
                    {item.due.toLocaleString()}
                  </span>
                </p>
              </div>
              <button className="text-sm text-green-600 hover:underline">✓ Mark Done</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
