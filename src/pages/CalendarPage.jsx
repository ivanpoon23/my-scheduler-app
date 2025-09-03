import React, { useState } from "react";
import useCanvasAssignments from "../hooks/useCanvasAssignments";

export default function CalendarPage() {
  const [filter, setFilter] = useState("unsubmitted");
  const { data: assignments = [], isLoading } = useCanvasAssignments({
    onlyUnsubmitted: filter === "unsubmitted",
  });

  const today = new Date();

  // Current month start & end
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Back up to the Sunday before (or same day if already Sunday)
  const startDate = new Date(firstOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Forward to the Saturday after (or same day if already Saturday)
  const endDate = new Date(lastOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // Generate all days from startDate → endDate
  const days = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header + filter */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {today.toLocaleString("default", { month: "long", year: "numeric" })}
        </h1>
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
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}

          {/* Calendar cells */}
          {days.map((date) => {
            const dateStr = date.toDateString();
            const isToday = dateStr === today.toDateString();
            const isCurrentMonth = date.getMonth() === today.getMonth();

            const dayAssignments = assignments.filter(
              (a) => a.due && new Date(a.due).toDateString() === dateStr
            );

            return (
              <div
                key={dateStr}
                className={`min-h-[100px] p-2 rounded-2xl shadow-sm text-left border transition
                  ${isToday ? "bg-yellow-100 border-yellow-400" : ""}
                  ${!isCurrentMonth ? "bg-gray-100 text-gray-400" : "bg-white"}
                `}
              >
                <div className="text-xs font-bold flex justify-between items-center">
                  <span>{date.getDate()}</span>
                  {isToday && (
                    <span className="text-[10px] text-yellow-700 font-medium">
                      Today
                    </span>
                  )}
                </div>

                {dayAssignments.map((a) => (
                  <div
                    key={`${a.id}-${a.course}`}
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
