import React from 'react'

interface ConfirmModalProps {
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  isDangerous?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Reusable confirmation modal component
 * Replaces hardcoded modals in DeletePost and UpdatePost
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel
}) => (
  <div className="delete-modal-overlay" onClick={onCancel}>
    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
      <h2>{title}</h2>
      <div>{message}</div>
      <div className="delete-modal-actions">
        <button
          onClick={onConfirm}
          className={isDangerous ? 'blog-btn danger' : 'blog-btn primary'}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="blog-btn secondary"
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmModal
