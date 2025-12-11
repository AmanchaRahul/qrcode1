import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export const ImageRedirect = () => {
  const { id } = useParams<{ id: string }>()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const redirectToImage = async () => {
      try {
        if (!id) throw new Error('No image ID provided')

        // Fetch image record
        const { data, error: dbError } = await supabase
          .from('images')
          .select('storage_path')
          .eq('id', id)
          .single()

        if (dbError || !data) throw new Error('Image not found')

        // Generate signed URL (10 minutes expiry)
        const { data: urlData, error: storageError } = await supabase.storage
          .from('images')
          .createSignedUrl(data.storage_path, 600)

        if (storageError || !urlData) throw new Error('Failed to generate image URL')

        // Redirect to signed URL
        window.location.href = urlData.signedUrl
      } catch (err) {
        console.error('Redirect error:', err)
        setError(true)
        setLoading(false)
      }
    }

    redirectToImage()
  }, [id])

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Redirecting to image...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Image Not Found</h1>
          <p className="text-gray-600 mb-6">
            The image you're looking for doesn't exist or has been deleted.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    )
  }

  return null
}
