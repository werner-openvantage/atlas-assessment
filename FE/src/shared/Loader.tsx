import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import animationData from '../../assets/loading.json'

interface LoaderProps {
  size?: number | string
  ariaLabel?: string
}

const Loader: React.FC<LoaderProps> = ({ size = 72, ariaLabel = 'Loading' }) => {
  const container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!container.current) return

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData as any
    })

    return () => anim.destroy()
  }, [])

  const s = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      ref={container}
      role="img"
      aria-label={ariaLabel}
      style={{ width: s, height: s, display: 'inline-block' }}
    />
  )
}

export default Loader
