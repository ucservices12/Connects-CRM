const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const organizationRoutes = require('./routes/organizationRoutes');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leadRoutes = require('./routes/leadRoutes');
const taskRoutes = require('./routes/taskRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assetRoutes = require('./routes/assetRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/salaries', salaryRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/email-templates', emailTemplateRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Company Management API' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});