import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { ImageRecord } from '../lib/supabase'
import QRCode from 'qrcode'
import { Trash2, ExternalLink, Download, Eye } from 'lucide-react'

export const Dashboard = () => {
  const { user } = useAuth()
  const [images, setImages] = useState<ImageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchImages()
    }
  }, [user])

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setImages(data || [])

      // Generate QR codes for all images
      const baseUrl =
        (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
        window.location.origin

      const qrCodePromises = (data || []).map(async (img) => {
        const url = `${baseUrl}/i/${img.id}`
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: 'H',
        })
        return { id: img.id, qrDataUrl }
      })

      const qrResults = await Promise.all(qrCodePromises)
      const qrMap: { [key: string]: string } = {}
      qrResults.forEach(({ id, qrDataUrl }) => {
        qrMap[id] = qrDataUrl
      })
      setQrCodes(qrMap)
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this image and QR code?')) {
      return
    }

    setDeleting(imageId)
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([storagePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw dbError

      // Update local state
      setImages(images.filter((img) => img.id !== imageId))
      const newQrCodes = { ...qrCodes }
      delete newQrCodes[imageId]
      setQrCodes(newQrCodes)
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image')
    } finally {
      setDeleting(null)
    }
  }

  const handleViewImage = async (storagePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .createSignedUrl(storagePath, 600) // 10 minutes

      if (error) throw error

      setSelectedImage(data.signedUrl)
    } catch (err) {
      console.error('Error getting signed URL:', err)
      alert('Failed to load image')
    }
  }

  const handleDownloadQR = (imageId: string) => {
    const qrDataUrl = qrCodes[imageId]
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-code-${imageId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My QR Codes</h1>
          <p className="text-gray-600">Manage your uploaded images and QR codes</p>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't uploaded any images yet.</p>
            <a
              href="/generate"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Generate Your First QR Code
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {images.map((image) => (
                    <tr key={image.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {qrCodes[image.id] && (
                          <img
                            src={qrCodes[image.id]}
                            alt="QR Code"
                            className="h-20 w-20 border border-gray-200 rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 break-all max-w-xs">
                          {`${window.location.origin}/i/${image.id}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(image.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(image.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewImage(image.storage_path)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View Image"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadQR(image.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                            title="Download QR"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <a
                            href={`/i/${image.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition"
                            title="Open Link"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDelete(image.id, image.storage_path)}
                            disabled={deleting === image.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-screen rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
