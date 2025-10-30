import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { createPost } from '../utils/api'

export default function CreatePost() {
  const { register, handleSubmit, control } = useForm({ defaultValues: { title: '', description: '' } })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await createPost(data)
      navigate('/posts')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register('title', { required: true })} />
        </div>

        <div>
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  )
}
