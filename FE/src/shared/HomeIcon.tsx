import React from 'react'

interface Props {
  className?: string
}

const HomeIcon: React.FC<Props> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 9.5L12 3l9 6.5" />
    <path d="M9 22V12h6v10" />
    <path d="M21 22H3" />
  </svg>
)

export default HomeIcon
