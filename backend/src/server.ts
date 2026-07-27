import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import employeeRoutes from '../routes/employees';
import User from '../models/User';
import Assignment from '../models/Assignment';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mocking Mongoose since we don't have a database connection for this test environment
const mockEmployees = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    role: 'Employee',
    department: 'Engineering'
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    role: 'Employee',
    department: 'Design'
  }
];

const mockAssignments = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    assignedTo: mockEmployees[0]._id,
    asset: {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'MacBook Pro 16"',
      type: 'Laptop',
      serialNumber: 'SN-APPLE-123'
    },
    assignedDate: new Date(),
    conditionOut: 'New'
  }
];

// Override Mongoose methods
User.find = (() => ({
  select: () => Promise.resolve(mockEmployees)
})) as any;

User.findById = ((id: string) => ({
  select: () => Promise.resolve(mockEmployees.find(e => e._id === id))
})) as any;

Assignment.find = ((query: any) => {
  return {
    populate: () => {
      const assignments = mockAssignments.filter(a => a.assignedTo === query.assignedTo);
      return Promise.resolve(assignments);
    }
  };
}) as any;

// Routes
app.use('/api/employees', employeeRoutes);

// Seed Route (Temporary for testing)
app.post('/api/seed', (req, res) => {
  res.status(200).json({ message: 'Dummy data is mocked in memory!' });
});

app.listen(PORT, () => {
  console.log(`Test Server running on http://localhost:${PORT}`);
  console.log(`Mocking MongoDB data for testing Employee Directory module without a real DB.`);
});
