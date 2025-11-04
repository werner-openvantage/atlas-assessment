import React from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import Header from '../shared/Header'

type LoaderData = { user: any | null }

const App: React.FC = () => {
  const data = useLoaderData() as LoaderData
  return (
    <div>
      <Header user={data?.user} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
