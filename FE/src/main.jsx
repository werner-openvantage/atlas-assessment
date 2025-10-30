import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from 'react-router-dom'
import App from './routes/App'
import Home, { loader as homeLoader } from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import Posts, { loader as postsLoader } from './routes/Posts'
import CreatePost from './routes/CreatePost'
import UpdatePost from './routes/UpdatePost'
import DeletePost from './routes/DeletePost'
import PostDetails, { loader as postDetailsLoader } from './routes/PostDetails'
import { getCurrentUser } from './utils/api'
import './styles.css'

// root loader prefetched user
async function rootLoader() {
  try {
    const user = await getCurrentUser()
    return { user }
  } catch (err) {
    return { user: null }
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: rootLoader,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'posts', element: <Posts />, loader: postsLoader },
      { path: 'posts/new', element: <CreatePost /> },
      { path: 'posts/:id/edit', element: <UpdatePost /> },
      { path: 'posts/:id/delete', element: <DeletePost /> },
      { path: 'posts/:id', element: <PostDetails />, loader: postDetailsLoader }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
