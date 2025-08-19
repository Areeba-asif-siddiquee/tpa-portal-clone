# TPA Portal Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

### 1. Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE tpa_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Import Database Schema**
   ```bash
   mysql -u root -p tpa_portal < database/schema.sql
   mysql -u root -p tpa_portal < database/sample_data.sql
   ```

### 2. Backend Setup

1. **Configure Environment**
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **Update `.env` file** with your settings:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=tpa_portal

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Install Dependencies & Start Server**
   ```bash
   npm install
   npm run dev
   ```
   
   Backend will run on: http://localhost:5000

### 3. Frontend Setup

1. **Install Dependencies & Start Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
   Frontend will run on: http://localhost:3000

### 4. Access the Application

Open your browser and go to: **http://localhost:3000**

## 🔐 Demo Credentials

Use these accounts to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **System Admin** | admin@tpaportal.com | password123 | Full system access |
| **Manager** | ops.manager@tpaportal.com | password123 | Team management, reports |
| **Employee** | john.doe@tpaportal.com | password123 | Courses, surveys, training |

## 📁 Project Structure

```
TPA_Portal/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/            # Static assets
├── database/              # Database schemas and sample data
└── docs/                  # Documentation
```

## ✨ Features Implemented

### ✅ Completed Features
- **Authentication System**: Login, register, password reset with JWT
- **Role-Based Access**: Employee, Manager, Admin, SystemAdmin roles
- **Responsive Design**: Modern UI with Tailwind CSS
- **Dashboard**: Personalized dashboard with quick access
- **Navigation**: Role-based navigation and routing
- **Database Schema**: Complete database structure with sample data
- **API Foundation**: Core REST API endpoints

### 🚧 Features Ready for Implementation
- Course Management (CRUD operations)
- Survey System (creation, distribution, responses)
- Training Sectors (domain-specific training)
- Reporting & Analytics (charts, exports)
- Support System (help, feedback, tickets)
- File Management (uploads, resources)

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run tests
```

### Frontend
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Full Stack
```bash
npm run dev         # Start both backend and frontend
npm run install:all # Install all dependencies
```

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check database credentials in `.env`
3. Ensure database `tpa_portal` exists
4. Check if sample data is imported correctly

### Frontend Build Issues
1. Clear node_modules: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Check Node.js version (requires v16+)

### API Connection Issues
1. Verify backend is running on port 5000
2. Check CORS configuration
3. Verify frontend proxy settings in `vite.config.js`

## 📚 Next Steps

1. **Test the Application**: Use demo credentials to explore different user roles
2. **Customize Branding**: Update colors, logos, and styling in Tailwind config
3. **Implement Remaining Features**: Course management, surveys, reporting
4. **Add Real Data**: Replace sample data with your organization's data
5. **Deploy**: Set up production environment and deployment pipeline

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the database schema in `database/schema.sql`
3. Check API endpoints in `backend/routes/`
4. Review component structure in `frontend/src/`

---

**Happy coding! 🎉** The foundation is solid and ready for further development.
