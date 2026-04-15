import { login } from "@/app/login/actions.ts";

export default function LoginPage() {
    return (
        <form action={login}></form>
    )
}