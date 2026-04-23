// Die Bauanleitung vom Registrationsformular, easy erweiterbar
import type { FieldDefinition } from "@/components/form/FormField"

export const signupFields: FieldDefinition[] = [
	{ 
		id: 'firstname', 
		label: 'Vorname', 
		required: true, 
		autoComplete: 'given-name' 
	},
  { 
		id: 'lastname', 
		label: 'Nachname', 
		required: true, 
		autoComplete:'family-name' 
	},
  { 
		id: 'password', 
		label: 'Passwort', 
		type: 'password', 
		required: true, 
		minLength:8, 
		autoComplete: 'new-password' 
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		required: true,
		autoComplete: 'email',
	},
  { id: 'phone', 
		label: 'Telefonnummer', 
		type: 'tel', 
		required: true, 
		autoComplete: 'tel' 
	},
]

