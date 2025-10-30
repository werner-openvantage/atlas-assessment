import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { createPost } from '../utils/api'

type PostForm = { title: string; description: string }

const CreatePost: React.FC = () => {
  const { register, handleSubmit, control } = useForm<PostForm>({ defaultValues: { title: '', description: '' } })
  const navigate = useNavigate()

  const onSubmit = async (data: PostForm) => {
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

export default CreatePost
