// Felddefinitionen für das Registrierungsformular – einfach erweiterbar
import type { FieldDefinition } from "@/components/form/FormField"

export const signupFields: FieldDefinition[] = [
	{ 
		id: 'firstname', 
		label: 'Vorname', 
		required: true, 
		autoComplete: 'given-name', 
	},
  	{ 
		id: 'lastname', 
		label: 'Nachname', 
		required: true, 
		autoComplete:'family-name',
	},
  	{ 
		id: 'password', 
		label: 'Passwort', 
		type: 'password', 
		required: true, 
		minLength:8, 
		autoComplete: 'new-password',
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		required: true,
		autoComplete: 'email',
	},
	{ 
		id: 'phone', 
		label: 'Telefonnummer', 
		type: 'tel', 
		required: true, 
		autoComplete: 'tel',
	},
	{
		id: 'companyName',
		label: 'Firmenname',
		required: true,
		autoComplete: 'organization',
	},
	{
		id: 'companyAddress',
		label: 'Straße und Hausnummer der Niederlassung',
		required: true,
		autoComplete: 'street-address',
	},
	{
		id: 'companyPostcode',
		label: 'PLZ der Niederlassung',
		required: true,
		autoComplete: 'postal-code',
	},
	{
		id: 'companyCity', 
		label: 'Ort der Niederlassung',
		required: true,
		autoComplete: 'address-level2',
	},
	{
		id: 'companyPhone',
		label: 'Telefonnummer der Firma',
		type: 'tel',
		required: true,
	},
	{
		id: 'companyEmail',
		label: 'Email der Firma',
		type: 'email',
		required: true,
	},
	{
		id: 'companyContactPerson',
		label: 'Ansprechpartner (Name)',
		required: true,
	},
]

