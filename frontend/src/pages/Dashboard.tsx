import { Users, Laptop, CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [healthStatus, setHealthStatus] = useState("Checking API...");

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setHealthStatus(data.message))
      .catch(() => setHealthStatus("API unreachable"));
  }, []);

  const stats = [
    { label: "Total Assets", value: "1,240", icon: Laptop, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Assigned", value: "980", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Available", value: "245", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Total Employees", value: "850", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Welcome to IBM AssetTrack</h2>
          <p className="text-sm text-gray-500">Here is what's happening with your inventory today.</p>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          Backend API Status: <span className={healthStatus.includes("running") ? "text-green-600" : "text-red-600"}>{healthStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Development Workflow - Team of 7</h3>
        <div className="prose max-w-none text-sm text-gray-600">
          <p>This boilerplate provides a solid foundation for the MERN stack project. Here is a suggested division of work:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Member 1 (Auth & Users):</strong> JWT login, employee management, roles (Admin/User).</li>
            <li><strong>Member 2 (Asset CRUD):</strong> Add, edit, delete, view assets (Laptops, Monitors).</li>
            <li><strong>Member 3 (Assignments):</strong> Assigning/returning assets, tracking history.</li>
            <li><strong>Member 4 (Inventory & Search):</strong> Global search, filtering, category tracking.</li>
            <li><strong>Member 5 (Dashboard & Reports):</strong> Statistics, charts (Recharts), exporting reports.</li>
            <li><strong>Member 6 (Frontend Styling):</strong> UI/UX consistency, Tailwind components, responsive design.</li>
            <li><strong>Member 7 (Backend Architecture):</strong> Express routes, Mongoose models, error handling, DB schema.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
