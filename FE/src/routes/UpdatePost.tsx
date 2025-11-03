import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { fetchPost, updatePost } from '../utils/api'

type PostForm = { title: string; heading: string; content: string; imageUrl: string; createdAt: string }

const UpdatePost: React.FC = () => {
  const { id } = useParams()
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<PostForm>({
    defaultValues: { title: '', heading: '', content: '', imageUrl: '', createdAt: '' }
  })
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const imageUrl = watch('imageUrl')

  useEffect(() => {
    const load = async () => {
      try {
        const post = await fetchPost(id!)
        const createdDate = new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        reset({
          title: post.title,
          heading: post.heading || '',
          content: post.content,
          imageUrl: post.image_url || '',
          createdAt: createdDate
        })
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [id, reset])

  const onSubmit = async (data: PostForm) => {
    try {
      await updatePost(id!, {
        title: data.title,
        heading: data.heading,
        content: data.content,
        image_url: data.imageUrl
      })
      navigate(`/posts/${id}`)
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
      <h1>Edit Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="blog-form">
        {/* Publish Date (Read-only) */}
        <div className="form-group">
          <label>Publish Date</label>
          <div className="read-only-field">
            {watch('createdAt')}
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Featured Image</label>
          <div className="image-upload-wrapper">
            {imageUrl ? (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" />
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
                  style={{ display: 'none' }}
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
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your blog content here..."
              />
            )}
          />
          {errors.content && <p className="error">{errors.content.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="blog-btn primary" disabled={isUploading}>
            Update Post
          </button>
          <button
            type="button"
            className="blog-btn secondary"
            onClick={() => navigate(`/posts/${id}`)}
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePost
