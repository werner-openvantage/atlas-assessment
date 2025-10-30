import React from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import Header from '../shared/Header'

export default function App() {
  const data = useLoaderData()
  return (
    <div>
      <Header user={data?.user} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
