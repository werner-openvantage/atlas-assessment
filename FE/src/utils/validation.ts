// Regex patterns
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
export const EMAIL_REGEX = /\S+@\S+\.\S+/

// Validation rules for react-hook-form
export const passwordValidationRules = {
    required: 'Password required',
    pattern: {
        value: PASSWORD_REGEX,
        message:
            'Password must contain at least 8 characters, uppercase letter, lowercase letter, number, and special character'
    }
}

export const emailValidationRules = {
    required: 'Email required',
    pattern: {
        value: EMAIL_REGEX,
        message: 'Invalid email'
    }
}

// Password strength calculator
export const getPasswordStrength = (pwd: string): { strength: string; color: string } => {
    if (!pwd)
        return { strength: '', color: '' }

    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[@$!%*?&]/.test(pwd)) strength++

    if (strength <= 2)
        return { strength: 'Weak', color: '#ef4444' }
    if (strength === 3)
        return { strength: 'Fair', color: '#f97316' }
    if (strength === 4)
        return { strength: 'Good', color: '#eab308' }
    return { strength: 'Strong', color: '#22c55e' }
}

// Password requirements checklist
export const PasswordRequirements = {
    minLength: { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    lowercase: { label: 'Lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    uppercase: { label: 'Uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    number: { label: 'Number', test: (pwd: string) => /\d/.test(pwd) },
    special: { label: 'Special character', test: (pwd: string) => /[@$!%*?&]/.test(pwd) }
}
