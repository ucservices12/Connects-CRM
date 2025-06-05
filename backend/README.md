# Company Management System API

A comprehensive backend system for company management using Node.js, Express.js, and MongoDB.

## Features

### Core Features
- Organization management
- Role-based authentication system (Admin, HR, Employee, Manager)
- Employee management
- CRM system for lead/client tracking
- Task assignment and tracking
- HR operations (salary, leave, attendance, asset management)
- Role-based access control

### Email Template System
- Customizable email templates for different types of notifications
- Support for multiple templates per organization
- Default template selection
- Dynamic content using placeholders
- Template management (CRUD operations)

### Notification System
- Email notifications using Nodemailer (Gmail SMTP)
- WhatsApp notifications using Twilio
- Queue system using Bull for handling notifications
- Notification logging and tracking
- Automated triggers for various events

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update values:
   - MongoDB URI
   - JWT settings
   - SMTP settings (Gmail)
   - Twilio credentials
   - Redis URL
4. Start the server: `npm run dev`

## API Routes

### Authentication
- POST /api/v1/auth/register - Register a new user
- POST /api/v1/auth/login - Login
- GET /api/v1/auth/me - Get current user
- GET /api/v1/auth/logout - Logout

### Organizations
- GET /api/v1/organizations - Get all organizations
- POST /api/v1/organizations - Create organization
- GET /api/v1/organizations/:id - Get single organization
- PUT /api/v1/organizations/:id - Update organization
- DELETE /api/v1/organizations/:id - Delete organization

### Email Templates
- GET /api/v1/email-templates - Get all templates
- POST /api/v1/email-templates - Create template
- GET /api/v1/email-templates/:id - Get single template
- PUT /api/v1/email-templates/:id - Update template
- DELETE /api/v1/email-templates/:id - Delete template

### Employees
- GET /api/v1/employees - Get all employees
- POST /api/v1/employees - Create employee
- GET /api/v1/employees/:id - Get single employee
- PUT /api/v1/employees/:id - Update employee
- DELETE /api/v1/employees/:id - Delete employee

### Leads/CRM
- GET /api/v1/leads - Get all leads
- POST /api/v1/leads - Create lead
- GET /api/v1/leads/:id - Get single lead
- PUT /api/v1/leads/:id - Update lead
- DELETE /api/v1/leads/:id - Delete lead
- POST /api/v1/leads/:id/interactions - Add interaction to lead

### Tasks
- GET /api/v1/tasks - Get all tasks
- POST /api/v1/tasks - Create task
- GET /api/v1/tasks/:id - Get single task
- PUT /api/v1/tasks/:id - Update task
- DELETE /api/v1/tasks/:id - Delete task
- POST /api/v1/tasks/:id/comments - Add comment to task

### Salary
- GET /api/v1/salaries - Get all salaries
- POST /api/v1/salaries - Create salary record
- GET /api/v1/salaries/:id - Get single salary
- PUT /api/v1/salaries/:id - Update salary
- DELETE /api/v1/salaries/:id - Delete salary

### Leave
- GET /api/v1/leaves - Get all leaves
- POST /api/v1/leaves - Create leave request
- GET /api/v1/leaves/:id - Get single leave
- PUT /api/v1/leaves/:id - Update leave
- DELETE /api/v1/leaves/:id - Delete leave
- PUT /api/v1/leaves/:id/status - Update leave status

### Attendance
- GET /api/v1/attendance - Get all attendance records
- POST /api/v1/attendance/check-in - Record check-in
- PUT /api/v1/attendance/check-out/:id - Record check-out
- GET /api/v1/attendance/:id - Get single attendance record
- GET /api/v1/attendance/reports/monthly - Get monthly attendance report

### Assets
- GET /api/v1/assets - Get all assets
- POST /api/v1/assets - Create asset
- GET /api/v1/assets/:id - Get single asset
- PUT /api/v1/assets/:id - Update asset
- DELETE /api/v1/assets/:id - Delete asset
- POST /api/v1/assets/:id/assign - Assign asset
- POST /api/v1/assets/:id/return - Return asset

### Invoices
- POST   /api/v1/invoices          - Create invoice
- GET    /api/v1/invoices          - Get all invoices
- GET    /api/v1/invoices/:id      - Get single invoice
- PUT    /api/v1/invoices/:id      - Update invoice
- DELETE /api/v1/invoices/:id      - Delete invoice
- POST   /api/v1/invoices/:id/send - Send invoice email
- GET    /api/v1/invoices/:id/download - Download PDF
- GET    /api/v1/invoices/:id/public   - Get public link

### Invoice Settings
- GET    /api/v1/invoices/setting           - Get invoice settings (for current org/user)
- PUT    /api/v1/invoices/setting           - Update invoice settings
- POST   /api/v1/invoices/setting    - Reset invoice settings to defaults

## Role-based Access Control

- **Admin**: Full access to all resources and operations
- **HR**: Access to employee, salary, leave, attendance, and asset management
- **Manager**: Can create/update tasks and leads, approve leaves
- **Employee**: Basic access to own profile, tasks, and leave requests

## Data Models

- Organization
- User/Auth
- Employee
- Lead/CRM
- Task
- Salary
- Leave
- Attendance
- Asset
- EmailTemplate
- NotificationLog

## Development

- Run in development mode: `npm run dev`
- Run in production mode: `npm start`

## License

MIT