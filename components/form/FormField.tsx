export type FieldDefinition = {
  id: string
  label: string
  type?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
}

type FormFieldProps = {
	field: FieldDefinition
}

export function FormField({ field }: FormFieldProps) {
	return (
		<div>
			<label htmlFor={ field.id }>{ field.label }</label>
			<input 
				id={ field.id }
				name={ field.id }
				type={ field.type }
				required={ field.required }
				minLength={ field.minLength }
				autoComplete={ field.autoComplete }
				/>
		</div>
	)
}
