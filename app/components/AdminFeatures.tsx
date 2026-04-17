// ADMIN - Features component
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

// TypeScript needs "Types by Inference", no other solution then adding Props object
type Props = {
    firstname: string
    lastname: string
}

export default function AdminFeatures({ firstname, lastname }: Props) {
    const [url, setUrl] = useState('');

    return (
        <main>
            <h1>Admin</h1>
            <p>Willkommen, {firstname}, {lastname}</p>

            <div>
                // qrcode logic
            </div>
        </main>
    )
}