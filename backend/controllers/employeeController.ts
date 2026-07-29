import { Request, Response } from 'express';

// ==========================================
// MEMBER 4: EMPLOYEE CONTROLLER
// Task: Implement employee directory and profile view.
// Safeguard: Returns mock employees list for now since MongoDB is disconnected.
// ==========================================

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  const mockEmployees = [
    { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@ibm.com', department: 'Software Engineering', role: 'Employee' },
    { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@ibm.com', department: 'UX Design', role: 'Employee' },
    { _id: '3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@ibm.com', department: 'Human Resources', role: 'Employee' },
    { _id: '4', firstName: 'Diana', lastName: 'Prince', email: 'diana@ibm.com', department: 'Data Science', role: 'Admin' }
  ];
  res.json(mockEmployees);
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  const employeeId = req.params.id;
  const mockEmployees = [
    { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@ibm.com', department: 'Software Engineering', role: 'Employee' },
    { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@ibm.com', department: 'UX Design', role: 'Employee' },
    { _id: '3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie@ibm.com', department: 'Human Resources', role: 'Employee' },
    { _id: '4', firstName: 'Diana', lastName: 'Prince', email: 'diana@ibm.com', department: 'Data Science', role: 'Admin' }
  ];
  
  const employee = mockEmployees.find(e => e._id === employeeId);
  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  const assignedAssets = [
    {
      assignmentId: 'a1',
      assignedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      conditionOut: 'Excellent',
      asset: { name: 'MacBook Pro 16"', category: 'Laptop', status: 'Assigned' }
    },
    {
      assignmentId: 'a2',
      assignedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      conditionOut: 'Good',
      asset: { name: 'Dell UltraSharp 27"', category: 'Monitor', status: 'Assigned' }
    }
  ];

  res.json({
    employee,
    assets: assignedAssets
  });
};
