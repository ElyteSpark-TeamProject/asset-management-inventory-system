import { useState, useEffect } from "react";
import { ClipboardList, Link } from "lucide-react";

// ==========================================
// MEMBER 3: ASSIGNMENTS PAGE (FRONTEND)
// Task: Display assigned assets, handle assign/return forms
// ==========================================

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/assignments")
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Asset Assignments</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
          <Link className="w-4 h-4" /> Assign Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
        {assignments.length === 0 ? (
           <div className="text-center text-gray-500 py-8">
             <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
             <p>No active assignments. Start assigning assets to employees.</p>
           </div>
        ) : (
          <ul className="divide-y divide-gray-200">
             {assignments.map((assignment, i) => (
                <li key={i} className="py-4 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-medium text-gray-900">Asset: {assignment.assetName}</p>
                     <p className="text-sm text-gray-500">Assigned To: {assignment.assignedTo}</p>
                   </div>
                   <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                     Mark Returned
                   </button>
                </li>
             ))}
          </ul>
        )}
      </div>
    </div>
  );
}
