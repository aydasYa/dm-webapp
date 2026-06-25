import { signout } from "@/app/actions/account"
import { Button } from "./ui/button"

export default function LogoutButton() {
    return (
        <form action={signout}>
            <Button type="submit" variant="destructive">Abmelden</Button>
        </form>
    )
}
