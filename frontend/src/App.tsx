import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Assignments from "./pages/Assignments";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

// Placeholders for unassigned modules
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
    <h2 className="text-xl font-medium text-gray-600">{title} Module</h2>
    <p className="text-gray-400 mt-2">Team member to implement this page.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="employees" element={<Employees />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
