import React from 'react'
import Loader from './Loader'

interface OverlayLoaderProps {
  size?: number | string
  message?: string
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ size = 96, message }) => {
  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <Loader size={size} ariaLabel={message ?? 'Loading'} />
        {message && <div style={messageStyle}>{message}</div>}
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
}

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  alignItems: 'center'
}

const messageStyle: React.CSSProperties = {
  color: 'white',
  fontSize: 16
}

export default OverlayLoader
