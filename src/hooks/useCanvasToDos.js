// src/hooks/useCanvasToDos.js
import { useEffect, useState } from 'react';

export default function useCanvasToDos(canvasToken) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasToken) return;

    const fetchData = async () => {
      try {
        const res = await fetch('https://canvas.instructure.com/api/v1/users/self/upcoming_events', {
          headers: {
            Authorization: `Bearer ${canvasToken}`,
          },
        });
        const data = await res.json();
        const formatted = data.map((item) => ({
          title: item.title,
          due: item.start_at.split('T')[0],
        }));
        setTodos(formatted);
        setLoading(false);
      } catch (err) {
        console.error('Canvas fetch failed', err);
        setLoading(false);
      }
    };

    fetchData();

    // Optional: re-fetch every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [canvasToken]);

  return { todos, loading };
}
