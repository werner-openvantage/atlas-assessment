import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { fetchPost, updatePost } from '../utils/api'

type PostForm = { title: string; description: string }

const UpdatePost: React.FC = () => {
  const { id } = useParams()
  const { register, handleSubmit, control, reset } = useForm<PostForm>({ defaultValues: { title: '', description: '' } })
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const post = await fetchPost(id!)
        reset({ title: post.title, description: post.description })
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [id])

  const onSubmit = async (data: PostForm) => {
    try {
      await updatePost(id!, data)
      navigate(`/posts/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Update Post</h2>
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
            render={({ field }) => <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />}
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default UpdatePost
