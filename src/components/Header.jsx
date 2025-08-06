import { Link } from 'react-router-dom';
import { CalendarCheck, ListTodo } from 'lucide-react'; // Optional icons

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* App name / logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-blue-600">
          Canvas Scheduler
        </Link>

        {/* Navigation links */}
        <div className="flex gap-6 items-center text-sm font-medium text-gray-700">
          <Link to="/todo" className="hover:text-blue-600 flex items-center gap-1">
            <ListTodo size={16} /> To-Do
          </Link>
          <Link to="/calendar" className="hover:text-blue-600 flex items-center gap-1">
            <CalendarCheck size={16} /> Calendar
          </Link>
        </div>
      </nav>
    </header>
  );
}
