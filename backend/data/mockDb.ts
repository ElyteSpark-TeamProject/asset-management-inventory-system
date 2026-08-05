import bcrypt from "bcryptjs";

const mockHash = bcrypt.hashSync("password123", 10);

export const mockDb = {
  users: [
    { _id: '1', firstName: 'Alice', lastName: 'Smith', name: 'Alice Smith', email: 'alice@company.com', department: 'Software Engineering', role: 'Employee', password: mockHash },
    { _id: '2', firstName: 'Bob', lastName: 'Jones', name: 'Bob Jones', email: 'bob@company.com', department: 'UX Design', role: 'Employee', password: mockHash },
    { _id: '3', firstName: 'Charlie', lastName: 'Brown', name: 'Charlie Brown', email: 'charlie@company.com', department: 'Human Resources', role: 'Employee', password: mockHash },
    { _id: '4', firstName: 'Diana', lastName: 'Prince', name: 'Diana Prince', email: 'admin@company.com', department: 'Data Science', role: 'Admin', password: mockHash }
  ],
  assets: [
    { _id: "A001", name: "ThinkPad T14", category: "Laptop", status: "Available", serialNumber: "LAP-0001", purchaseDate: "2024-02-15T00:00:00.000Z" },
    { _id: "A002", name: "Dell UltraSharp 27", category: "Monitor", status: "Assigned", serialNumber: "MON-0001", purchaseDate: "2023-08-20T00:00:00.000Z" },
    { _id: "A003", name: "MacBook Pro 14", category: "Laptop", status: "Available", serialNumber: "LAP-0002", purchaseDate: "2023-11-01T00:00:00.000Z" },
    { _id: "A004", name: "Logitech Wireless Mouse", category: "Accessory", status: "Available", serialNumber: "ACC-0001", purchaseDate: "2024-01-10T00:00:00.000Z" },
    { _id: "A005", name: "Microsoft Office 365", category: "Software", status: "Assigned", serialNumber: "SW-0001", purchaseDate: "2024-03-05T00:00:00.000Z" },
    { _id: "A006", name: "HP EliteBook 840", category: "Laptop", status: "Maintenance", serialNumber: "LAP-0003", purchaseDate: "2022-09-12T00:00:00.000Z" },
    { _id: "A007", name: "LG UltraWide Monitor", category: "Monitor", status: "Retired", serialNumber: "MON-0002", purchaseDate: "2021-05-30T00:00:00.000Z" },
  ],
  assignments: [
    {
      _id: "a1",
      asset: { _id: "A002", name: "Dell UltraSharp 27", serialNumber: "MON-0001", category: "Monitor", status: "Assigned" },
      assignedTo: { _id: "1", name: "Alice Smith", email: "alice@company.com", department: 'Software Engineering' },
      assignedBy: { _id: "4", name: "Diana Prince" },
      assignedDate: "2023-10-01T00:00:00Z",
      returnDate: null,
      conditionOut: "Good",
      conditionIn: undefined,
      status: "Active"
    },
    {
      _id: "a2",
      asset: { _id: "A005", name: "Microsoft Office 365", serialNumber: "SW-0001", category: "Software", status: "Assigned" },
      assignedTo: { _id: "2", name: "Bob Jones", email: "bob@company.com", department: 'UX Design' },
      assignedBy: { _id: "4", name: "Diana Prince" },
      assignedDate: "2024-03-05T00:00:00Z",
      returnDate: null,
      conditionOut: "New",
      conditionIn: undefined,
      status: "Active"
    }
  ]
};
