import Link from "next/link"


export default function Home() {
    return (
        <div className="m-8 h-full">
            <div>
                <h1 
                className="text-3xl"
                >
                    Willkommen auf dem Abschlepper Dashboard!
                </h1>
                
                {/* Testbereich */}
                <p>
                    Eine App von <span className="text-green-500 font-bold">Dein Motorschaden
                    </span>
                </p>
            </div>

            {/* Registrierung & Login per Link */}
            <Link href="/login" className="mt-6 inline-block bg-green-500 rounded-full px-6 py-3">Zum Login</Link>
        </div>
    )
}
