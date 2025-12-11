import React, { useState } from 'react';
import useCanvasAssignments, { markAssignmentDone } from '../hooks/useCanvasAssignments';
import { useDummyCanvasAssignments } from '../hooks/useCanvasAssignments';
import { CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from 'react-router-dom';

export default function ToDoPage() {
  const [filter, setFilter] = useState('unsubmitted'); // "unsubmitted" | "all"
  const onlyUnsubmitted = filter === 'unsubmitted';
  const [doneAssignments, setDoneAssignments] = useState(new Set());

  const { data: assignments = [], isLoading, error } = useDummyCanvasAssignments({ onlyUnsubmitted });
  console.log("Fetched assignments:", assignments);

  const handleToggleDone = async (title) => {
    setDoneAssignments((prev) => {
      const newSet = new Set(prev);
      newSet.add(title);
      return newSet;
    });
    await markAssignmentDone(title);
  };

  // Filter assignments based on tab
    const filtered = assignments.filter((item) => {
      const isSubmitted = item.has_submitted_submissions;
      const isMarkedDone = doneAssignments.has(item.title);

      if (filter === "unsubmitted") {
        return !isSubmitted && !isMarkedDone;
      }
      return true; 
    });

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
      {/* {If error navigate to login} */}
      {isLoading ? (
        <p className="text-gray-500">Loading assignments…</p>
      ) : error ? (
        // Console error for debugging
        console.error(error) ||
        <Navigate to="/login" replace />
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Finished All Assignments</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {filtered.map((item, index) => {
              const isSubmitted = item.has_submitted_submissions;
              const isMarkedDone = doneAssignments.has(item.title);
              
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 200 }}
                  transition={{ duration: 0.4 }}
                  className={`bg-white rounded-2xl shadow p-4 flex justify-between items-center border ${
                    isMarkedDone ? "border-green-400 opacity-70" : "border-gray-100"
                  }`}
                >
                  <div>
                    <h2
                      className={`font-semibold text-lg ${
                        isSubmitted ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Due:{" "}
                      {item.due ? (
                        <span className="text-blue-600 font-medium">
                          {new Date(item.due).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No due date</span>
                      )}
                    </p>
                    {isSubmitted && (
                      <p className="text-xs text-green-600 mt-1">Submitted ✅</p>
                    )}
                    {isMarkedDone && (
                      <p className="text-xs text-purple-600 mt-1">Marked Done 🎉</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{item.course}</span>
                    {!isSubmitted && !isMarkedDone && (
                      <button
                        onClick={() => handleToggleDone(item.title)}
                        className="text-sm font-medium px-3 py-1 rounded bg-gray-200 hover:bg-green-600 hover:text-white transition"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
