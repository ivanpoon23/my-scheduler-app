import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ToDoPage from './pages/ToDoPage';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  const token = localStorage.getItem("canvas_token");

  if (!token) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        No Canvas token found. Please set it in localStorage manually:<br />
        <code>localStorage.setItem("canvas_token", "YOUR_TOKEN");</code>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/todo" replace />} />
        <Route path="/todo" element={<ToDoPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}
