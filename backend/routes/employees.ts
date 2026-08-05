import express from 'express';
import { getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employeeController';

const router = express.Router();

// GET /api/employees - List all employees
router.get('/', getAllEmployees);

// GET /api/employees/:id - Get employee details and assigned assets
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id - Update employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', deleteEmployee);

export default router;
