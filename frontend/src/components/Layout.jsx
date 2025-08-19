import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, hasRole } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['Employee', 'Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Courses', href: '/courses', icon: BookOpenIcon, roles: ['Employee', 'Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Surveys', href: '/surveys', icon: ClipboardDocumentListIcon, roles: ['Employee', 'Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Training', href: '/training', icon: AcademicCapIcon, roles: ['Employee', 'Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Support', href: '/support', icon: QuestionMarkCircleIcon, roles: ['Employee', 'Manager', 'Admin', 'SystemAdmin'] },
    { name: 'Admin', href: '/admin', icon: Cog6ToothIcon, roles: ['Admin', 'SystemAdmin'] },
  ]

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  )

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile menu */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-secondary-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <h1 className="text-xl font-bold text-primary-600">TPA Portal</h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {filteredNavigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className={`nav-link ${
                                location.pathname.startsWith(item.href)
                                  ? 'nav-link-active'
                                  : 'nav-link-inactive'
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <item.icon className="h-6 w-6 shrink-0" />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-primary-600">TPA Portal</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`nav-link ${
                          location.pathname.startsWith(item.href)
                            ? 'nav-link-active'
                            : 'nav-link-inactive'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-secondary-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-500"
              >
                <BellIcon className="h-6 w-6" />
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200" />

              {/* Profile dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-secondary-500">{user?.roleName}</div>
                  </div>
                  
                  {/* User menu */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="p-2 text-secondary-400 hover:text-secondary-500"
                      title="Profile"
                    >
                      <UserIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-secondary-400 hover:text-secondary-500"
                      title="Logout"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
