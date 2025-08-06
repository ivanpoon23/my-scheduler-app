import React, { useState } from 'react';
import useCanvasAssignments from '../hooks/useCanvasAssignments';
import { CalendarDays } from 'lucide-react';

export default function ToDoPage() {
  const { assignments, loading } = useCanvasAssignments();
  const [filter, setFilter] = useState("unsubmitted"); // "unsubmitted" | "all"
  console.log("Assignments:", assignments);
  // Filter logic
  const filtered = assignments.filter(item => {
    if (filter === "unsubmitted") {
      return !item.submission || item.submission.workflow_state !== "submitted";
    }
    return true;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <CalendarDays className="text-blue-600" />
        To-Do List
      </h1>

      {/* Filter to show all vs unsubmitted assignments */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("unsubmitted")}
          className={`px-3 py-1 rounded ${
            filter === "unsubmitted" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Unsubmitted
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All Upcoming
        </button>
      </div>

      {/* Loading or empty state */}
      {loading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">You're all caught up! 🎉</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item, i) => (
            <li
              key={i}
              className="bg-white rounded-2xl shadow p-4 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-500">
                  Due:{" "}
                  <span className="text-blue-600 font-medium">
                    {new Date(item.due).toLocaleString()}
                  </span>
                </p>
                {item.submission?.workflow_state === "submitted" && (
                  <p className="text-xs text-green-600 mt-1">Submitted ✅</p>
                )}
              </div>
              <button className="text-sm text-green-600 hover:underline">✓ Mark Done</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
