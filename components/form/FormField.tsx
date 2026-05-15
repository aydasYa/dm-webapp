import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"

export type FieldDefinition = {
  id: string
  label: string
  group: 'personal' | 'company'
  type?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
  description?: string
}

type FormFieldProps = {
  field: FieldDefinition
}

export function FormField({ field }: FormFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        minLength={field.minLength}
        autoComplete={field.autoComplete}
      />
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  )
}