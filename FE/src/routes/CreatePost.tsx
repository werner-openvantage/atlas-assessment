import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../utils/api'
import Loader from '../shared/Loader'

type PostForm = { title: string; heading: string; content: string; imageUrl: string }

const CreatePost: React.FC = () => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PostForm>({
    defaultValues: { title: '', heading: '', content: '', imageUrl: '' }
  })
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const imageUrl = watch('imageUrl')

  const onSubmit = async (data: PostForm) => {
    try {
      await createPost({
        title: data.title,
        heading: data.heading,
        content: data.content,
        image_url: data.imageUrl
      })
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/uploads`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) throw new Error('Upload failed')
      const result = await response.json()
      setValue('imageUrl', result.data.imageUrl)
    } catch (err) {
      console.error('Image upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="blog-form-container">
      {isUploading && (
        <div className="overlay-loader">
          <div className="overlay-loader-content">
            <Loader isLoading={true} size={96} />
          </div>
        </div>
      )}
      <h1>Create Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
        {/* Image Upload */}
        <div className="form-group">
          <label>Featured Image</label>
          <div className="image-upload-wrapper">
            {imageUrl ? (
              <div className="image-preview">
                <img 
                  src={imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${imageUrl}`}
                  alt="Preview" 
                />
                <button
                  type="button"
                  onClick={() => setValue('imageUrl', '')}
                  className="remove-image-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="file-input-hidden"
                />
                <div className="upload-placeholder">
                  {isUploading ? 'Uploading...' : 'Click to upload image or drag and drop'}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Title must be at least 5 characters' } })}
            placeholder="Enter post title"
            disabled={isUploading}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        {/* Heading */}
        <div className="form-group">
          <label>Heading</label>
          <input
            {...register('heading', { required: 'Heading is required', minLength: { value: 5, message: 'Heading must be at least 5 characters' } })}
            placeholder="Enter post heading"
            disabled={isUploading}
          />
          {errors.heading && <p className="error">{errors.heading.message}</p>}
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            placeholder="Write your blog content here..."
            className="content-textarea"
            rows={10}
            disabled={isUploading}
          />
          {errors.content && <p className="error">{errors.content.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="blog-btn primary" disabled={isUploading}>
            Publish Post
          </button>
          <button
            type="button"
            className="blog-btn secondary"
            onClick={() => navigate('/')}
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
