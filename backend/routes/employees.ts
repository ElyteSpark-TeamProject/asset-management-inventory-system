import express from 'express';
import { getAllEmployees, getEmployeeById } from '../controllers/employeeController';

const router = express.Router();

// GET /api/employees - List all employees
router.get('/', getAllEmployees);

// GET /api/employees/:id - Get employee details and assigned assets
router.get('/:id', getEmployeeById);

export default router;
