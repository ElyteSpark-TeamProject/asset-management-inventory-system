import React, { useState, useEffect } from 'react';
import { Search, UserCircle, Briefcase, Mail, Monitor, Tag, Calendar, X, Plus, Loader2, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Interfaces for our data models
interface Employee {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  department?: string;
  role: string;
}

interface Asset {
  _id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: string;
}

interface Assignment {
  assignmentId: string;
  assignedDate: string;
  conditionOut: string;
  asset: Asset;
}

interface EmployeeDetails {
  employee: Employee;
  assets: Assignment[];
}

const Employees: React.FC = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the selected employee modal
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State for Add/Edit User modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [addName, setAddName] = useState<string>('');
  const [addEmail, setAddEmail] = useState<string>('');
  const [addPassword, setAddPassword] = useState<string>('');
  const [addRole, setAddRole] = useState<string>('Employee');
  const [addDepartment, setAddDepartment] = useState<string>('');
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>('');

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Ensure Vite proxy is set up to route /api to the backend server
      const response = await fetch('/api/employees', { headers: { "Authorization": `Bearer ${token}` } });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      // The backend returns firstName and lastName, but our component uses it
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      // If the backend is not running, let's use some mock data so the UI can still be previewed
      setError('Backend connection failed. Displaying mock data for demonstration.');
      setEmployees([
        { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@company.com', department: 'Software Engineering', role: 'Employee' },
        { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@company.com', department: 'UX Design', role: 'Employee' },
        { _id: '3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@company.com', department: 'Human Resources', role: 'Employee' },
        { _id: '4', firstName: 'Diana', lastName: 'Prince', email: 'diana@company.com', department: 'Data Science', role: 'Admin' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openEmployeeModal = async (employeeId: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const response = await fetch(`/api/employees/${employeeId}`, { headers: { "Authorization": `Bearer ${token}` } });
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const data = await response.json();
      setSelectedEmployee(data);
    } catch (err) {
      console.error("Error fetching employee details:", err);
      // Mock data fallback if the backend is down
      const mockEmp = employees.find(e => e._id === employeeId);
      if (mockEmp) {
        setSelectedEmployee({
          employee: mockEmp,
          assets: [
            {
              assignmentId: 'a1',
              assignedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              conditionOut: 'Excellent',
              asset: { _id: 'as1', name: 'MacBook Pro 16"', category: 'Laptop', serialNumber: 'MBP-12345', status: 'Assigned' }
            },
            {
              assignmentId: 'a2',
              assignedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
              conditionOut: 'Good',
              asset: { _id: 'as2', name: 'Dell UltraSharp 27"', category: 'Monitor', serialNumber: 'DEL-98765', status: 'Assigned' }
            }
          ]
        });
      }
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };
  
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const url = editEmployeeId ? `/api/employees/${editEmployeeId}` : "/api/auth/register";
      const method = editEmployeeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: addName, email: addEmail, password: addPassword, role: addRole, department: addDepartment }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || (editEmployeeId ? "Update failed" : "Registration failed"));
      
      setIsAddModalOpen(false);
      setEditEmployeeId(null);
      setAddName('');
      setAddEmail('');
      setAddPassword('');
      setAddRole('Employee');
      setAddDepartment('');
      fetchEmployees(); // refresh list
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const openEditModal = (emp: Employee) => {
    setEditEmployeeId(emp._id);
    setAddName(`${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || '');
    setAddEmail(emp.email);
    setAddPassword('');
    setAddRole(emp.role || 'Employee');
    setAddDepartment(emp.department || '');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to delete employee");
      fetchEmployees();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = (emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`).toLowerCase();
    const dept = emp.department ? emp.department.toLowerCase() : '';
    const search = searchQuery.toLowerCase();
    return fullName.includes(search) || 
           emp.email.toLowerCase().includes(search) ||
           dept.includes(search);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 dark:text-white tracking-tight">Employee Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Manage personnel and view their assigned company assets.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 dark:bg-gray-800 dark:text-white pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-800 shadow-sm"
              placeholder="Search by name, email..."
            />
          </div>
          <button
            onClick={() => {
              setEditEmployeeId(null);
              setAddName('');
              setAddEmail('');
              setAddPassword('');
              setAddRole('Employee');
              setAddDepartment('');
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Employee</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 dark:divide-gray-700">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-lg">{(employee.name || employee.firstName || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 dark:text-white">{employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center mt-0.5">
                            <Mail className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-200 flex items-center font-medium">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                        {employee.department || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => openEmployeeModal(employee._id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center"
                        >
                          View Assets
                        </button>
                        <button onClick={() => openEditModal(employee)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(employee._id)} className="text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400 dark:text-gray-500">
              <UserCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white">No employees found.</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Employee Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
            aria-hidden="true" 
            onClick={closeModal}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-3xl z-10 flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto">
              {modalLoading ? (
                <div className="flex justify-center items-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedEmployee ? (
                <div>
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 sm:flex sm:items-start relative">
                    <button 
                      onClick={closeModal}
                      className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors bg-white dark:bg-gray-800/10 rounded-full p-1"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-white dark:bg-gray-800 sm:mx-0 shadow-lg border-4 border-blue-500/30">
                       <span className="text-blue-700 font-bold text-4xl">{(selectedEmployee.employee.name || selectedEmployee.employee.firstName || 'U').charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="mt-4 text-center sm:mt-2 sm:ml-6 sm:text-left">
                      <h3 className="text-3xl font-bold text-white mb-2 tracking-tight" id="modal-title">
                        {selectedEmployee.employee.name || `${selectedEmployee.employee.firstName || ''} ${selectedEmployee.employee.lastName || ''}`}
                      </h3>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-6 text-blue-100 text-sm font-medium">
                        <div className="flex items-center justify-center sm:justify-start">
                          <Mail className="h-4 w-4 mr-2 opacity-80" /> {selectedEmployee.employee.email}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Briefcase className="h-4 w-4 mr-2 opacity-80" /> {selectedEmployee.employee.department || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modal Body - Assets */}
                  <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 dark:text-white mb-6 flex items-center">
                      <Monitor className="h-6 w-6 mr-2 text-blue-600" />
                      Currently Held Assets
                      <span className="ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {selectedEmployee.assets?.length || 0} total
                      </span>
                    </h4>
                    
                    {selectedEmployee.assets && selectedEmployee.assets.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedEmployee.assets.map((assignment) => (
                          <div key={assignment.assignmentId} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow hover:border-blue-200 group">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-bold text-gray-900 dark:text-gray-100 dark:text-white group-hover:text-blue-700 transition-colors">
                                {assignment.asset?.name || 'Unknown Asset'}
                              </h5>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                                {assignment.asset?.category || 'N/A'}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                                  <Tag className="h-4 w-4 mr-2" />
                                  <span>Serial No</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{assignment.asset?.serialNumber || 'N/A'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>Assigned</span>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">
                                  {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                  }) : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                        <Monitor className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-1">No Assets Assigned</h3>
                        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">This employee does not currently hold any company assets.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="bg-white dark:bg-gray-800 px-6 py-5 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gray-900 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                    <X className="h-full w-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white">Failed to load</h3>
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Could not retrieve employee details at this time.</p>
                  <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-md z-10">
              <form onSubmit={handleAddSubmit}>
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlus className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 dark:text-white" id="modal-title">
                        {editEmployeeId ? "Edit Employee" : "Add New Employee"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {addError && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {addError}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                          <input type="text" required value={addName} onChange={(e) => setAddName(e.target.value)} className="mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                          <input type="email" required value={addEmail} onChange={(e) => setAddEmail(e.target.value)} className="mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none dark:bg-gray-800 dark:text-white" />
                        </div>
                        {!editEmployeeId && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                            <input type="password" required={!editEmployeeId} minLength={8} value={addPassword} onChange={(e) => setAddPassword(e.target.value)} className="mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none dark:bg-gray-800 dark:text-white" placeholder="Minimum 8 characters" />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Department</label>
                          <input type="text" value={addDepartment} onChange={(e) => setAddDepartment(e.target.value)} className="mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
                          <select value={addRole} onChange={(e) => setAddRole(e.target.value)} className="mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border outline-none dark:bg-gray-800 dark:text-white">
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" disabled={addLoading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </button>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
