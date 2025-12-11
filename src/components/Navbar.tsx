import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { QrCode, LogOut, Home, Upload, LayoutDashboard } from 'lucide-react'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <QrCode className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">QR Image App</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/generate"
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Upload className="h-5 w-5" />
                  <span>Generate QR</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
