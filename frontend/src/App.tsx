import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";

// Placeholders for unassigned modules
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
    <h2 className="text-xl font-medium text-gray-600">{title} Module</h2>
    <p className="text-gray-400 mt-2">Team member to implement this page.</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Placeholder title="Login" />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Placeholder title="Dashboard" />} />
        <Route path="assets" element={<Placeholder title="Assets" />} />
        <Route path="employees" element={<Employees />} />
        <Route path="assignments" element={<Placeholder title="Assignments" />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
