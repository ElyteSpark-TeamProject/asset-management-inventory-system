import { Users, Laptop, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [healthStatus, setHealthStatus] = useState("Checking API...");
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setHealthStatus(data.message))
      .catch(() => setHealthStatus("API unreachable"));
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/reports/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const stats = [
    { label: "Total Assets", value: statsData?.totalAssets || 0, icon: Laptop, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Assigned", value: statsData?.assigned || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Available", value: statsData?.available || 0, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Total Employees", value: statsData?.totalEmployees || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const pieData = statsData?.assetsByStatus || [];
  const barData = statsData?.assetsByCategory || [];
  // Ensure barData has some colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Welcome to Corp AssetTrack, {user?.name || 'User'}</h2>
          <p className="text-sm text-gray-500">Here is what's happening with your inventory today.</p>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 flex items-center">
          <span className="mr-2">Backend API Status:</span>
          <span className={`flex h-2.5 w-2.5 rounded-full mr-2 ${healthStatus.includes("running") ? "bg-green-500" : "bg-red-500"}`}></span>
          <span className={healthStatus.includes("running") ? "text-green-700" : "text-red-700"}>{healthStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-200">
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets by Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Assets by Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, "Assets"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assets by Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Assets by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip
                  cursor={{fill: '#f3f4f6'}}
                  formatter={(value: number) => [value, "Assets"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {barData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
