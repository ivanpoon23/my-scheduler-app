import { useQuery } from '@tanstack/react-query';

export default function useCanvasAssignments({ onlyUnsubmitted = false } = {}) {
  const token = localStorage.getItem('canvas_token');

  return useQuery({
    queryKey: ['canvasAssignments', onlyUnsubmitted], 
    queryFn: async () => {                             
      if (!token) throw new Error('No Canvas token found.');

      const params = new URLSearchParams();
      if (onlyUnsubmitted) params.append('only_unsubmitted', 'true');

      const res = await fetch(`http://localhost:8000/api/canvas/assignments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const raw = await res.json();

      return raw.map((item) => ({
        id: item.id,
        title: item.name || item.title,
        due: item.due_at || item.due,
        course: item.course_name || null,
        submission: item.submission || null,
        has_submitted_submissions: item.has_submitted_submissions || false,
      }));
    },
    staleTime: 1000 * 60 * 5,  // cache for 5 minutes
    keepPreviousData: true,    // optional
  });
}
