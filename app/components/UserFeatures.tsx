// user features dashboard, contains each element the user (abschlepper/Tow-truck-drive
// can see and their possible interactions with the webapp
type Props = {
    firstname: string
    lastname: string
    status: string
}

export default function UserFeatures({ firstname, lastname, status }: Props) {
    return (
        <main className="p-8">
            <h1 className="text-2xl font-semibold">Abschlepper Dashboard</h1>
            <p className="text-muted-foreground mt-1">
                Willkommen, <span className="font-semibold">{firstname} {lastname}</span>
            </p>

            <p className="text-sm text-muted-foreground mt-1">
                Status: {status}
            </p>
        </main>
    )
}