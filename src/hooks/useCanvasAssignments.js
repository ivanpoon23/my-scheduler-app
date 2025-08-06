import { useEffect, useState } from 'react';

export default function useCanvasAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("canvas_token");

  useEffect(() => {
    if (!token) return;

    const fetchAssignments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/canvas/assignments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const upcoming = data
          .filter(item => item.start_at)
          .map(item => ({
            title: item.title,
            due: new Date(item.start_at),
          }))
          .sort((a, b) => a.due - b.due);

        setAssignments(upcoming);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  return { assignments, loading };
}
