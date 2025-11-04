import React from 'react'
import { getPasswordStrength, PasswordRequirements } from '../utils/validation'

interface PasswordStrengthIndicatorProps {
  password: string
}

/**
 * Reusable password strength indicator with requirements checklist
 * Shows visual strength indicator and lists what requirements are met
 */
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const passwordStrength = getPasswordStrength(password)

  if (!password) return null

  return (
    <>
      <div className="password-strength">
        <div
          className="strength-bar"
          style={{
            width: `${(password.length / 20) * 100}%`,
            backgroundColor: passwordStrength.color
          }}
        />
        <span style={{ color: passwordStrength.color }}>
          Strength: {passwordStrength.strength}
        </span>
      </div>
      <div className="password-requirements">
        <p>Password must contain:</p>
        <ul>
          {Object.entries(PasswordRequirements).map(([key, { label, test }]) => (
            <li key={key} className={test(password) ? 'met' : ''}>
              ✓ {label}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default PasswordStrengthIndicator
