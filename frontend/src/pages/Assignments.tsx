import React, { useState, useEffect } from "react";
import { ClipboardList, Link, Search, Filter, Loader2, LogIn, ArrowRightLeft, Laptop } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, isAdmin } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  
  // Assign form state
  const [assetId, setAssetId] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [conditionOut, setConditionOut] = useState("New");

  // Return form state
  const [conditionIn, setConditionIn] = useState("Good");

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/assignments", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      setAssignments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    try {
      const [assetsRes, employeesRes] = await Promise.all([
        fetch("/api/assets", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/employees", { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        // Only show available assets
        setAssets(assetsData.filter((a: any) => a.status === "Available"));
      }
      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      }
    } catch (err) {
      console.error("Error fetching lookups", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    if (isAdmin) {
      fetchLookups();
    }
  }, [token, isAdmin]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      const res = await fetch("/api/assignments/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assetId, assignedToId, conditionOut })
      });
      if (!res.ok) throw new Error("Failed to assign asset");
      
      setShowAssignModal(false);
      setAssetId("");
      setAssignedToId("");
      setConditionOut("New");
      fetchAssignments();
      fetchLookups(); // Refresh lookups
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      const res = await fetch(`/api/assignments/return/${selectedAssignmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ conditionIn })
      });
      if (!res.ok) throw new Error("Failed to return asset");
      
      setShowReturnModal(false);
      setConditionIn("Good");
      setSelectedAssignmentId("");
      fetchAssignments();
      fetchLookups(); // Refresh lookups
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Asset Assignments</h2>
          <p className="text-sm text-gray-500">Track and manage asset checkouts and returns.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Link className="w-4 h-4" /> Assign Asset
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : assignments.length === 0 ? (
           <div className="text-center text-gray-500 py-12">
             <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
             <h3 className="text-lg font-medium text-gray-900">No active assignments</h3>
             <p className="text-gray-500 mt-1">Start assigning assets to employees to track them here.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  {isAdmin && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment, i) => (
                  <tr key={assignment._id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100 text-blue-600">
                          <Laptop className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{assignment.asset?.name || "Unknown Asset"}</div>
                          <div className="text-sm text-gray-500">{assignment.asset?.serialNumber || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.assignedTo?.name || (assignment.assignedTo?.firstName ? `${assignment.assignedTo.firstName} ${assignment.assignedTo.lastName}` : "Unknown User")}</div>
                      <div className="text-sm text-gray-500">{assignment.assignedTo?.email || ""}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.returnDate ? new Date(assignment.returnDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        assignment.status === "Returned" 
                          ? "bg-gray-100 text-gray-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {assignment.status || (assignment.returnDate ? "Returned" : "Active")}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {(!assignment.returnDate && assignment.status !== "Returned") && (
                          <button 
                            onClick={() => {
                              setSelectedAssignmentId(assignment._id);
                              setShowReturnModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto font-semibold"
                          >
                            <ArrowRightLeft className="w-4 h-4" /> Return
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Asset</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Asset</label>
                <select 
                  required
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none"
                >
                  <option value="">Select an available asset</option>
                  {assets.map(a => (
                    <option key={a._id || a.id} value={a._id || a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select 
                  required
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none"
                >
                  <option value="">Select an employee</option>
                  {employees.map(e => (
                    <option key={e._id || e.id} value={e._id || e.id}>
                      {e.name || (e.firstName ? `${e.firstName} ${e.lastName}` : "User")} - {e.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Condition Out</label>
                <select 
                  value={conditionOut}
                  onChange={(e) => setConditionOut(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={assignLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {assignLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Assign Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Return Asset</h3>
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Condition Returned In</label>
                <select 
                  value={conditionIn}
                  onChange={(e) => setConditionIn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={assignLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {assignLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
