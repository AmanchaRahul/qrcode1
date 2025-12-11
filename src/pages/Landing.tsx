import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { QrCode, Upload, Shield, Zap } from 'lucide-react'

export const Landing = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <QrCode className="h-20 w-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Images Securely with QR Codes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your images, generate QR codes, and share them securely.
            Your images are stored privately and accessed through temporary signed URLs.
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/generate"
                  className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Generate QR Code
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Upload</h3>
            <p className="text-gray-600">
              Drag and drop your images or click to upload. Simple and intuitive interface.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
            <p className="text-gray-600">
              Your images are stored in private buckets with temporary signed URLs for access.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Zap className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant QR Codes</h3>
            <p className="text-gray-600">
              Generate high-quality QR codes instantly and download them as PNG images.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Upload Your Image</h4>
                <p className="text-gray-600">Select and upload the image you want to share.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Generate QR Code</h4>
                <p className="text-gray-600">
                  System automatically generates a secure QR code linked to your image.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Share & Scan</h4>
                <p className="text-gray-600">
                  Download or share the QR code. Anyone scanning it gets secure access to your image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
