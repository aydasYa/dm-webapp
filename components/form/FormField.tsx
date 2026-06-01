import { Input } from "@/components/ui/input"
import type * as React from "react"
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
  maxLength?: number
  pattern?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
  description?: string
}

type FormFieldProps = {
  field: FieldDefinition
}

export function FormField({ field }: FormFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={field.id}>
        {field.label}
        {field.required && (
          <>
            <span className="text-red-600">*</span>
            <span className="sr-only">Pflichtfeld</span>
          </>
        )}
      </FieldLabel>
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        pattern={field.pattern}
        maxLength={field.maxLength}
        minLength={field.minLength}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
      />
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  )
}