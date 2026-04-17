// ADMIN - Features component
import { QRCodeSVG } from 'qrcode.react';
// import { useState } from 'react';

// TypeScript needs "Types by Inference", no other solution then adding Props object
type Props = {
    firstname: string
    lastname: string
}

export default function AdminFeatures({ firstname, lastname }: Props) {
    // const [url, setUrl] = useState('');

    return (
        <main>
            <div className="m-8">
                <h1 className="text-4xl">Admin</h1>
                <p  className="text-xl"> Willkommen, {firstname}, {lastname}</p>
            </div>

            <div>
                {/* qrcode logic - not done yet */}
            </div>
        </main>
    )
}