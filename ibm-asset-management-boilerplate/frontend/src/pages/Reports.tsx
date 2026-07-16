import { useState, useEffect } from "react";
import { BarChart, Download } from "lucide-react";

// ==========================================
// MEMBER 5: REPORTS PAGE (FRONTEND)
// Task: Display analytics charts (Recharts) and export logic
// ==========================================

export default function Reports() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    fetch("/api/reports/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics & Reports</h2>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-200 font-medium">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
         <div className="text-center max-w-lg mx-auto py-12">
            <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Reports Module Placeholder</h3>
            <p className="text-gray-500 mt-2">
              Member 5: Use <code>recharts</code> to build visual graphs here using the stats from the backend.
            </p>
            {stats && (
              <div className="mt-6 bg-gray-50 p-4 rounded text-left text-sm font-mono text-gray-600">
                <pre>{JSON.stringify(stats, null, 2)}</pre>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
