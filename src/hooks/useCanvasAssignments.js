import { useEffect, useState } from "react";

export default function useCanvasAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("canvas_token");

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) {
        setError("No Canvas token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/canvas/getdummyassignments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const raw = await res.json();

        // Normalize data for frontend usage
        const normalized = raw.map((item) => ({
          id: item.id,
          title: item.name || item.title, // support both real and dummy data
          due: item.due_at ? new Date(item.due_at) : null,
          course: item.course_name || null,
          submission: item.submission || null,
        }));

        setAssignments(normalized);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setError("Failed to fetch assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  return { assignments, loading };
}
