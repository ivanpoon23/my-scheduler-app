import { useQuery } from "@tanstack/react-query";


export default function useCanvasAssignments({ onlyUnsubmitted = false } = {}) {
  // const token = localStorage.getItem("canvas_token");

//   return useQuery({
//     queryKey: ["canvasAssignments", onlyUnsubmitted],
//     queryFn: async () => {
//       if (!token) throw new Error("No Canvas token found.");

//       const params = new URLSearchParams();
//       if (onlyUnsubmitted) params.append("only_unsubmitted", "true");

//       const res = await fetch(
//         `http://localhost:8000/api/canvas/assignments?${params.toString()}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (!res.ok) throw new Error(`API error: ${res.status}`);

//       const raw = await res.json();

//       return raw
//         .map((item) => ({
//           id: item.id,
//           title: item.name || item.title,
//           due: item.due_at || item.due,
//           course: item.course_name || null,
//           submission: item.submission || null,
//           has_submitted_submissions: item.has_submitted_submissions || false,
//           done: item.done || false,
//         }))
//         .sort((a, b) => {
//           const dateA = a.due ? new Date(a.due).getTime() : Infinity;
//           const dateB = b.due ? new Date(b.due).getTime() : Infinity;
//           return dateA - dateB;
//         });
//     },
//     staleTime: 1000 * 60 * 5,
//     keepPreviousData: true,
//   });
// }
// export function markAssignmentDone(assignmentTitle) {
//   const token = localStorage.getItem("canvas_token");
//   if (!token) throw new Error("No Canvas token found.");

//   return fetch(`http://localhost:8000/api/canvas/assignments/${assignmentTitle}/done`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
// export function unmarkAssignmentDone(assignmentTitle) {
//   const token = localStorage.getItem("canvas_token");
//   if (!token) throw new Error("No Canvas token found.");

//   return fetch(`http://localhost:8000/api/canvas/assignments/${assignmentTitle}/done`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

// DUmmy assignments for testing
  return useQuery({
    queryKey: ['canvasAssignments', onlyUnsubmitted], 
    queryFn: async () => {                             
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const now = new Date();
      return [
        { id: 1, title: 'Math Homework', due: new Date(now.getTime() + 86400000).toISOString(), course: 'Math 101', has_submitted_submissions: false },
        { id: 2, title: 'Science Project', due: new Date(now.getTime() + 172800000).toISOString(), course: 'Science 202', has_submitted_submissions: true },
        { id: 3, title: 'History Essay      ', due: new Date(now.getTime() + 259200000).toISOString(), course: 'History 303', has_submitted_submissions: false },
      ].filter(a => (onlyUnsubmitted ? !a.has_submitted_submissions : true));
    },
    staleTime: 1000 * 60 * 5,  // cache for 5 minutes
    keepPreviousData: true, 
    });
  }