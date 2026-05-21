"use client"

import { Button } from "@/components/ui/button"
import { cancelLead } from "@/app/actions/leads"

type Props = {
	leadId: string
}

export default function CancelLeadButton({ leadId }: Props) {
	return (
		<form
			action={cancelLead}
			onSubmit={(e) => {
				if (!confirm("Lead wirklich stornieren? Das kann nicht rückgängig gemacht werden.")) {
					e.preventDefault()
				}
			}}
		>
			<input type="hidden" name="leadId" value={leadId} />
			<Button type="submit" variant="destructive">Stornieren</Button>
		</form>
	)
}