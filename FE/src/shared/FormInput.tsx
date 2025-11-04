import React from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  error?: FieldError
  register: UseFormRegisterReturn
  disabled?: boolean
  autoComplete?: string
}

/**
 * Reusable form input component with integrated error display
 * Reduces boilerplate across form pages
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  error,
  register,
  disabled = false,
  autoComplete
}) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      {...register}
    />
    {error && <p className="error">{error.message}</p>}
  </div>
)

export default FormInput
