# TPA Portal - Training Portal Application

A comprehensive training portal application built with React.js, Node.js, Express, MySQL, and Tailwind CSS.

## Features

- **Authentication System**: Multi-role authentication (Employee, Manager, Admin, SystemAdmin)
- **Course Management**: Complete CRUD operations for training courses
- **Survey Management**: Create, distribute, and analyze training surveys
- **Training Sectors**: Domain-based training assignment (IGL, Admin, Customer Service, CNG Projects, etc.)
- **Data Analytics**: Comprehensive reporting and visualization dashboard
- **User Support**: Built-in help system, FAQs, and feedback collection
- **Approval Workflows**: Multi-level approval and review processes

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: JWT tokens
- **Charts**: Chart.js / Recharts
- **File Exports**: PDF, Excel

## Project Structure

```
TPA_Portal/
├── frontend/          # React.js application
├── backend/           # Node.js/Express API server
├── database/          # MySQL schema and sample data
└── docs/             # Documentation and resources
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Database Setup**
   - Create a MySQL database named `tpa_portal`
   - Import the schema from `database/schema.sql`
   - Configure database connection in `backend/.env`

3. **Environment Configuration**
   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials and JWT secret

4. **Run Development**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

## User Roles

- **Employee**: Access training materials, submit surveys, view assigned courses
- **Manager**: Manage team training, approve requests, view reports
- **Admin**: Full course management, survey creation, user management
- **SystemAdmin**: Complete system access, maintenance, and configuration

## API Documentation

API endpoints are documented in `docs/api-documentation.md`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
