import React from 'react'
import { useLoaderData } from 'react-router-dom'

type LoaderData = { user: any | null }

const Profile: React.FC = () => {
  const data = useLoaderData() as LoaderData
  const user = data?.user

  if (!user) return <div>Please login to view your profile.</div>

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  )
}

export default Profile
