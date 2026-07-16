import { useState, useEffect } from "react";
import { Users } from "lucide-react";

// ==========================================
// MEMBER 4: EMPLOYEES PAGE (FRONTEND)
// Task: Display employee directory, handle add/edit employee
// ==========================================

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/employees")
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.length === 0 ? (
           <div className="col-span-full text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-100">
             <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
             <p>No employees found.</p>
           </div>
        ) : (
           employees.map((emp, i) => (
             <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{emp.name}</h3>
                  <p className="text-sm text-gray-500">{emp.department} • {emp.role}</p>
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}
