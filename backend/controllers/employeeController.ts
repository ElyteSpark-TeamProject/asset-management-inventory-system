import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Assignment } from '../models/Assignment';
import { mockDb } from '../data/mockDb';
import bcrypt from "bcryptjs";

// ==========================================
// MEMBER 4: EMPLOYEE CONTROLLER
// Task: Implement employee directory and profile view, with CRUD.
// ==========================================

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const employees = await User.find().select('-password');
      res.json(employees);
    } else {
      res.json(mockDb.users);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const employee = await User.findById(employeeId).select('-password');
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      const assignments = await Assignment.find({ assignedTo: employeeId, status: 'Active' })
        .populate('asset', 'name category serialNumber status');
        
      const assignedAssets = assignments.map(a => ({
        assignmentId: a._id,
        assignedDate: a.assignedDate,
        conditionOut: a.conditionOut,
        asset: a.asset
      }));
      
      res.json({ employee, assets: assignedAssets });
    } else {
      const employee = mockDb.users.find(e => e._id === employeeId || e._id === req.params.id);
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      const assignedAssets = mockDb.assignments
        .filter(a => (a.assignedTo._id === employeeId || a.assignedTo._id === req.params.id) && a.status === 'Active')
        .map(a => ({
          assignmentId: a._id,
          assignedDate: a.assignedDate,
          conditionOut: a.conditionOut,
          asset: a.asset
        }));

      res.json({
        employee,
        assets: assignedAssets
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.params.id;
    const { name, email, department, role, password } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const employee = await User.findById(employeeId);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      if (name) employee.name = name;
      if (email) employee.email = email;
      if (department) employee.department = department;
      if (role) employee.role = role;
      if (password) employee.password = await bcrypt.hash(password, 10);
      
      await employee.save();
      res.json({ message: 'Employee updated', employee });
    } else {
      const idx = mockDb.users.findIndex(e => e._id === employeeId);
      if (idx === -1) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      if (name) mockDb.users[idx].name = name;
      if (email) mockDb.users[idx].email = email;
      if (department) mockDb.users[idx].department = department;
      if (role) mockDb.users[idx].role = role;
      if (password) mockDb.users[idx].password = bcrypt.hashSync(password, 10);
      
      // Update firstName / lastName based on name
      if (name) {
        const names = name.split(" ");
        mockDb.users[idx].firstName = names[0];
        mockDb.users[idx].lastName = names.length > 1 ? names.slice(1).join(" ") : "";
      }
      
      res.json({ message: 'Employee updated', employee: mockDb.users[idx] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.params.id;
    
    if (mongoose.connection.readyState === 1) {
      const employee = await User.findById(employeeId);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      await User.findByIdAndDelete(employeeId);
      res.json({ message: 'Employee deleted' });
    } else {
      const idx = mockDb.users.findIndex(e => e._id === employeeId);
      if (idx === -1) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      mockDb.users.splice(idx, 1);
      res.json({ message: 'Employee deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
