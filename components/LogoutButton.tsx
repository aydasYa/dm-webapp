import { signout } from "@/app/actions/auth"

export default function LogoutButton() {
    return (
        <form action={signout}>
            <button type="submit">Abmelden</button>
        </form>
    )
}
