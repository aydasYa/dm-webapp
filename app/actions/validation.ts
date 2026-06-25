export const NAME_PATTERN = /^[A-Za-zÄÖÜäöüß\-\s]+$/
export const PHONE_PATTERN = /^[0-9+\-\/()\s]+$/
export const POSTCODE_PATTERN = /^[0-9]{5}$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? ''
}

export type SignupFields = {
  email: string; password: string; passwordConfirm: string
  firstname: string; lastname: string; phone: string
  companyName: string; companyAddress: string; companyPostcode: string
  companyCity: string; companyPhone: string; companyEmail: string
  companyWebsite: string;
}

export function validateSignup(d: SignupFields): string | null {
  const { companyWebsite, ...required } = d
  if (Object.values(required).some(v => !v.trim())) return 'missing_fields'
  if (d.password.length < 8) return 'password_too_short'
  if (d.password !== d.passwordConfirm) return 'password_mismatch'
  if (!EMAIL_PATTERN.test(d.email)) return 'invalid_email'
  if (!EMAIL_PATTERN.test(d.companyEmail)) return 'invalid_email'
  if (!POSTCODE_PATTERN.test(d.companyPostcode)) return 'invalid_format'
  if (!PHONE_PATTERN.test(d.phone)) return 'invalid_format'
  if (!PHONE_PATTERN.test(d.companyPhone)) return 'invalid_format'
  const nameFields = [d.firstname, d.lastname, d.companyCity]
  if (nameFields.some(v => !NAME_PATTERN.test(v))) return 'invalid_format'
  return null
}