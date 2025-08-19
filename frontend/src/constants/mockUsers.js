// src/constants/mockUsers.js
export const MOCK_USERS = [
  {
    email: "admin@company.com",
    password: "adminpass",
    role: "admin",
    permissions: ["all_permissions"],
    name: "Admin User",
  },
  {
    email: "user@company.com",
    password: "userpass",
    role: "employee",
    permissions: ["view_courses", "take_assessment"],
    name: "Regular User",
  },
  {
    email: "manager@company.com",
    password: "managerpass",
    role: "manager",
    permissions: ["manage_team", "view_reports"],
    name: "Manager User",
  }
];
