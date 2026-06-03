"use client"

import { useState } from "react"
import type * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
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
  title?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  autoComplete?: string
  description?: string
  options?: { value: string; label: string }[]
}

type FormFieldProps = {
  field: FieldDefinition
}

const SELECT_CLASS = "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

function getErrorMessage(input: HTMLInputElement, field: FieldDefinition): string | null {
  const value = input.value

  if (!value) {
    return field.required ? "Dieses Feld ist ein Pflichtfeld." : null
  }

  if (field.minLength && value.length < field.minLength) {
    return `Mindestens ${field.minLength} Zeichen erforderlich.`
  }

  if (field.pattern && !new RegExp(`^(?:${field.pattern})$`).test(value)) {
    return field.title ?? "Bitte überprüfe deine Eingabe."
  }

  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Bitte eine gültige E-Mail-Adresse eingeben."
  }

  return null
}

export function FormField({ field }: FormFieldProps) {
  const [error, setError] = useState<string | null>(null)

  function validate(input: HTMLInputElement) {
    setError(getErrorMessage(input, field))
  }

  const label = (
    <FieldLabel htmlFor={field.id}>
      {field.label}
      {field.required && (
        <>
          <span className="text-red-600">*</span>
          <span className="sr-only">Pflichtfeld</span>
        </>
      )}
    </FieldLabel>
  )

  if (field.options) {
    return (
      <Field>
        {label}
        <select
          id={field.id}
          name={field.id}
          required={field.required}
          aria-invalid={error ? true : undefined}
          className={SELECT_CLASS}
          onBlur={(e) => {
            if (field.required && !e.currentTarget.value) {
              setError("Dieses Feld ist ein Pflichtfeld.")
            } else {
              setError(null)
            }
          }}
          onChange={(e) => {
            if (error && e.currentTarget.value) setError(null)
          }}
        >
          <option value="">Bitte wählen</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="min-h-[1.25rem]">
          {error && <FieldError>{error}</FieldError>}
        </div>
        {field.description && <FieldDescription>{field.description}</FieldDescription>}
      </Field>
    )
  }

  return (
    <Field>
      {label}
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        pattern={field.pattern}
        title={field.title}
        maxLength={field.maxLength}
        minLength={field.minLength}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        aria-invalid={error ? true : undefined}
        onBlur={(e) => validate(e.currentTarget)}
        onChange={(e) => { if (error !== null) validate(e.currentTarget) }}
      />
      <div className="min-h-[1.25rem]">
        {error && <FieldError>{error}</FieldError>}
      </div>
      {field.description && (
        <FieldDescription>{field.description}</FieldDescription>
      )}
    </Field>
  )
}
