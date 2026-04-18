import { ValidationError } from './api-response'

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one uppercase, one lowercase, one number
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate phone number (basic Indian format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validate age
 */
export function validateAge(dateOfBirth: string, minAge: number = 16): boolean {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge
  }

  return age >= minAge
}

/**
 * Validate student signup data
 */
export function validateStudentSignup(data: any) {
  const errors: Record<string, string[]> = {}

  if (!data.firstName?.trim()) {
    errors.firstName = ['First name is required']
  }
  if (!data.lastName?.trim()) {
    errors.lastName = ['Last name is required']
  }
  if (!data.email?.trim()) {
    errors.email = ['Email is required']
  } else if (!validateEmail(data.email)) {
    errors.email = ['Invalid email format']
  }
  if (!data.password) {
    errors.password = ['Password is required']
  } else {
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors
    }
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match']
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Student signup validation failed', errors)
  }
}

/**
 * Validate institution signup data
 */
export function validateInstitutionSignup(data: any) {
  const errors: Record<string, string[]> = {}

  if (!data.institutionName?.trim()) {
    errors.institutionName = ['Institution name is required']
  }
  if (!data.contactPerson?.trim()) {
    errors.contactPerson = ['Contact person name is required']
  }
  if (!data.email?.trim()) {
    errors.email = ['Email is required']
  } else if (!validateEmail(data.email)) {
    errors.email = ['Invalid email format']
  }
  if (!data.password) {
    errors.password = ['Password is required']
  } else {
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors
    }
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match']
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Institution signup validation failed', errors)
  }
}

/**
 * Validate student profile update
 */
export function validateStudentProfileUpdate(data: any) {
  const errors: Record<string, string[]> = {}

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = ['Invalid phone number format']
  }
  if (data.dateOfBirth && !validateDate(data.dateOfBirth)) {
    errors.dateOfBirth = ['Invalid date format (YYYY-MM-DD)']
  }
  if (data.dateOfBirth && !validateAge(data.dateOfBirth)) {
    errors.dateOfBirth = ['You must be at least 16 years old']
  }
  if (data.annualFamilyIncome !== undefined) {
    if (typeof data.annualFamilyIncome !== 'number' || data.annualFamilyIncome < 0) {
      errors.annualFamilyIncome = ['Annual family income must be a positive number']
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Profile update validation failed', errors)
  }
}

/**
 * Validate financing application
 */
export function validateFinancingApplication(data: any) {
  const errors: Record<string, string[]> = {}

  if (!data.programId?.trim()) {
    errors.programId = ['Program is required']
  }
  if (!data.productId?.trim()) {
    errors.productId = ['Financing product is required']
  }
  if (!data.requestedAmount || data.requestedAmount <= 0) {
    errors.requestedAmount = ['Requested amount must be greater than 0']
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Financing application validation failed', errors)
  }
}

/**
 * Validate payment creation
 */
export function validatePaymentCreation(data: any) {
  const errors: Record<string, string[]> = {}

  if (!data.studentId?.trim()) {
    errors.studentId = ['Student ID is required']
  }
  if (!data.amount || data.amount <= 0) {
    errors.amount = ['Amount must be greater than 0']
  }
  if (data.amount > 10000000) {
    // Max 1 crore
    errors.amount = ['Amount exceeds maximum allowed']
  }
  if (!data.description?.trim()) {
    errors.description = ['Description is required']
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Payment creation validation failed', errors)
  }
}

/**
 * Validate query parameters
 */
export function validateQueryParams(params: any, schema: Record<string, 'string' | 'number' | 'boolean'>) {
  const errors: Record<string, string[]> = {}

  for (const [key, type] of Object.entries(schema)) {
    if (params[key] !== undefined) {
      const value = params[key]
      if (type === 'number' && isNaN(Number(value))) {
        errors[key] = [`${key} must be a number`]
      } else if (type === 'boolean' && !['true', 'false'].includes(String(value).toLowerCase())) {
        errors[key] = [`${key} must be a boolean`]
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Query parameter validation failed', errors)
  }
}
