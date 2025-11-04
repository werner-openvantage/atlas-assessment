import React from 'react'
import Loader from './Loader'

interface OverlayLoaderProps {
  size?: number | string
  message?: string
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ size = 96, message }) => {
  return (
    <div className="overlay-loader">
      <div className="overlay-loader-content">
        <Loader size={size} ariaLabel={message ?? 'Loading'} />
        {message && <div className="overlay-loader-message">{message}</div>}
      </div>
    </div>
  )
}

export default OverlayLoader
