// user features dashboard, contains each element the user (abschlepper/Tow-truck-drive
// can see and their possible interactions with the webapp
type Props = {
    firstname: string
    lastname: string
    status: string
}

export default function UserFeatures({ firstname, lastname, status }: Props) {
    return (
        <main>
            <div className="m-8">
                <h1 className="text-4xl">Abschlepper</h1>
                <p  className="text-xl"> Willkommen, {firstname}, {lastname}!</p>
            </div>
        </main>
    )
}