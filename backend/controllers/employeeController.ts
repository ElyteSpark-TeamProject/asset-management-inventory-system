import { Request, Response } from 'express';
// Assuming these models will be created by the teammate handling Authentication & Users / Asset Management Core
import User from '../models/User';
import Assignment from '../models/Assignment';

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private/Admin (Assuming protected route)
 */
export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch users with the role 'Employee'.
    // Use .select('-password') to ensure we don't send sensitive info to the client
    const employees = await User.find({ role: 'Employee' }).select('-password');
    
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Server error retrieving employees', 
      error: error.message || 'Unknown error' 
    });
  }
};

/**
 * @desc    Get employee details and currently assigned assets
 * @route   GET /api/employees/:id
 * @access  Private/Admin
 */
export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.params.id;

    // Fetch the employee details
    const employee = await User.findById(employeeId).select('-password');

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    // Fetch active assignments for this employee
    // Active means they haven't returned it yet (returnDate is either null or not set)
    const activeAssignments = await Assignment.find({ 
      assignedTo: employeeId,
      returnDate: { $in: [null, undefined] }
    }).populate('asset'); 

    // Format the response to be clean and easy to consume for the frontend
    const assignedAssets = activeAssignments.map((assignment: any) => ({
      assignmentId: assignment._id,
      assignedDate: assignment.assignedDate,
      conditionOut: assignment.conditionOut,
      // The populated asset details
      asset: assignment.asset 
    }));

    res.status(200).json({
      employee,
      assets: assignedAssets
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Server error retrieving employee details', 
      error: error.message || 'Unknown error' 
    });
  }
};
