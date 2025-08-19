import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">My Profile</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Manage your account settings and personal information
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-medium text-secondary-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Employee ID</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.employeeId || 'N/A'}</p>
            </div>
            
            <div>
              <label className="form-label">Email</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.email}</p>
            </div>
            
            <div>
              <label className="form-label">First Name</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.firstName}</p>
            </div>
            
            <div>
              <label className="form-label">Last Name</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.lastName}</p>
            </div>
            
            <div>
              <label className="form-label">Role</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.roleName}</p>
            </div>
            
            <div>
              <label className="form-label">Department</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.departmentName || 'Not assigned'}</p>
            </div>
            
            <div>
              <label className="form-label">Training Domain</label>
              <p className="mt-1 text-sm text-secondary-900">{user?.domainName || 'Not assigned'}</p>
            </div>
            
            <div>
              <label className="form-label">Last Login</label>
              <p className="mt-1 text-sm text-secondary-900">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <button className="btn btn-primary">
              Edit Profile
            </button>
            <button className="btn btn-outline ml-3">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
