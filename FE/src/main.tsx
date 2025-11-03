import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import App from './routes/App'
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import ForgotPassword from './routes/ForgotPassword'
import ResetPassword from './routes/ResetPassword'
import Posts from './routes/Posts'
import CreatePost from './routes/CreatePost'
import UpdatePost from './routes/UpdatePost'
import DeletePost from './routes/DeletePost'
import PostDetails from './routes/PostDetails'
import Profile from './routes/Profile'
import { getCurrentUser } from './utils/api'
import './styles.scss'

type RootLoaderData = { user: any | null }

async function rootLoader(): Promise<RootLoaderData> {
  try {
    // Check if token exists before trying to fetch user
    if (!localStorage.getItem('authToken')) {
      return { user: null }
    }
    
    const userResponse = await getCurrentUser()
    // Handle both { user: ... } and { data: { user: ... } } response formats
    const user = userResponse?.data || userResponse?.user
    return { user: user || null }
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
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:id', element: <ResetPassword /> },
      { path: 'posts', element: <Posts /> },
      { path: 'profile', element: <Profile /> },
      { path: 'posts/new', element: <CreatePost /> },
      { path: 'posts/:id/edit', element: <UpdatePost /> },
      { path: 'posts/:id/delete', element: <DeletePost /> },
      { path: 'posts/:id', element: <PostDetails /> }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
