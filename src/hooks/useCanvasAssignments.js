import { useQuery } from "@tanstack/react-query";
const BASE_URL = "/api/canvas/assignments";

export default function useCanvasAssignments({ onlyUnsubmitted = false } = {}) {
  
  return useQuery({
    queryKey: ["canvasAssignments", onlyUnsubmitted],
    queryFn: async () => {
      
      const params = new URLSearchParams();
      if (onlyUnsubmitted) params.append("only_unsubmitted", "true");

      const res = await fetch(
        `${BASE_URL}?${params.toString()}`,
        {
          credentials: 'include', 
        }
      );

      if (res.status === 401 || res.status === 404) {
          throw new Error("No Canvas token found or user unauthorized."); 
      }
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const raw = await res.json();
      
      return raw
        .map((item) => ({
          id: item.id,
          title: item.name || item.title,
          due: item.due_at || item.due,
          course: item.course || null,
          submission: item.submission || null,
          has_submitted_submissions: item.has_submitted_submissions || false,
          done: item.done || false,
        }))
        .sort((a, b) => {
          const dateA = a.due ? new Date(a.due).getTime() : Infinity;
          const dateB = b.due ? new Date(b.due).getTime() : Infinity;
          return dateA - dateB;
        });
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
}

export function markAssignmentDone(assignmentTitle) {  
  return fetch(`/api/canvas/assignments/${assignmentTitle}/done`, {
    method: "POST",
    credentials: 'include',
  });
}

export function unmarkAssignmentDone(assignmentTitle) {
  return fetch(`/api/canvas/assignments/${assignmentTitle}/done`, {
    method: "DELETE",
    credentials: 'include', 
  });
}
export function useDummyCanvasAssignments({ onlyUnsubmitted = false } = {}) {
  return useQuery({
    queryKey: ['canvasAssignments', onlyUnsubmitted], 
    queryFn: async () => {                             
      // Simulate network delay for a realistic loading state
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      
      const now = new Date();
      
      const dummyData = [
        { 
          id: 1, 
          title: 'Final Project Submission', 
          due: new Date(now.getTime() + 86400000 * 3).toISOString(), // Due in 3 days
          course: 'CS 401: Algorithms', 
          has_submitted_submissions: false,
          done: false,
        },
        { 
          id: 2, 
          title: 'Weekly Quiz 5', 
          due: new Date(now.getTime() + 86400000 * 0.5).toISOString(), // Due in 12 hours
          course: 'Math 205: Calculus', 
          has_submitted_submissions: false, // Not submitted
          done: false,
        },
        { 
          id: 3, 
          title: 'Literature Review Draft', 
          due: new Date(now.getTime() + 86400000 * 7).toISOString(), // Due in 1 week
          course: 'English 101', 
          has_submitted_submissions: true, // Already submitted
          done: false,
        },
        { 
          id: 4, 
          title: 'Read Chapter 4', 
          due: null, // No due date
          course: 'History 400', 
          has_submitted_submissions: false,
          done: true, // Marked done manually
        },
        { 
          id: 5, 
          title: 'Lab Report 2', 
          due: new Date(now.getTime() - 86400000).toISOString(), // Overdue by 1 day
          course: 'Physics 101', 
          has_submitted_submissions: false,
          done: false,
        },
      ];

      // Filter based on the 'onlyUnsubmitted' prop
      return dummyData
        .filter(a => (onlyUnsubmitted ? !a.has_submitted_submissions && !a.done : true))
        // Sort by date (using the same logic as the real hook)
        .sort((a, b) => {
          const dateA = a.due ? new Date(a.due).getTime() : Infinity;
          const dateB = b.due ? new Date(b.due).getTime() : Infinity;
          return dateA - dateB;
        });
    },
    staleTime: 1000 * 60 * 5,  // cache for 5 minutes
    keepPreviousData: true, 
  });
}