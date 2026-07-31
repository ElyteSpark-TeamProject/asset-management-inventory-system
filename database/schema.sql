-- Create Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Employee') DEFAULT 'Employee',
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Assets Table
CREATE TABLE assets (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('Laptop', 'Monitor', 'Accessory', 'Software', 'Equipment') NOT NULL,
    serial_number VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('Available', 'Assigned', 'Maintenance', 'Retired') DEFAULT 'Available',
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Assignments Table (Links Users to Assets)
CREATE TABLE assignments (
    id VARCHAR(255) PRIMARY KEY,
    asset_id VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status ENUM('Active', 'Returned') DEFAULT 'Active',
    condition_out VARCHAR(255) DEFAULT 'Good',
    condition_in VARCHAR(255) NULL,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for faster searching and filtering
CREATE INDEX idx_asset_status ON assets(status);
CREATE INDEX idx_assignment_status ON assignments(status);
CREATE INDEX idx_user_email ON users(email);
