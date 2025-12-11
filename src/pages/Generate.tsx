import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import QRCode from 'qrcode'
import { Upload, Download, Copy, Trash2, CheckCircle } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export const Generate = () => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [copied, setCopied] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('File too large. Maximum size is 5MB')
        return
      }

      setError('')
      setUploading(true)
      setProgress(0)

      try {
        if (!user) throw new Error('User not authenticated')

        // Create image preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        setProgress(30)

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        setProgress(60)

        // Insert record into database
        const { data: imageRecord, error: dbError } = await supabase
          .from('images')
          .insert({
            user_id: user.id,
            storage_path: uploadData.path,
          })
          .select()
          .single()

        if (dbError) throw dbError

        setProgress(80)

        // Generate short URL based on configured public site URL (fallback to current origin)
        const baseUrl =
          (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
          window.location.origin
        const imageUrl = `${baseUrl}/i/${imageRecord.id}`
        setShortUrl(imageUrl)

        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(imageUrl, {
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        })

        setQrCodeUrl(qrDataUrl)
        setProgress(100)
      } catch (err: any) {
        setError(err.message || 'Failed to upload image')
        console.error('Upload error:', err)
      } finally {
        setUploading(false)
      }
    },
    [user]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleReset = () => {
    setQrCodeUrl('')
    setShortUrl('')
    setImagePreview('')
    setError('')
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate QR Code</h1>
          <p className="text-gray-600">Upload an image to generate a QR code</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!qrCodeUrl ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 bg-white'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop the image here...</p>
            ) : (
              <>
                <p className="text-lg text-gray-700 mb-2">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="w-full rounded-lg border border-gray-200"
                  />
                )}
              </div>

              {/* QR Code */}
              <div>
                <h3 className="text-lg font-semibold mb-4">QR Code</h3>
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full rounded-lg border border-gray-200 mb-4"
                />
              </div>
            </div>

            {/* Short URL */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleDownloadQR}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="h-5 w-5" />
                <span>Download QR Code</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Trash2 className="h-5 w-5" />
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
