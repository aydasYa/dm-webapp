// Lädt .env.local/.env, BEVOR andere Module (z.B. lib/prisma) ihre Env-Variablen lesen.
// Muss als allererster Import stehen – ES-Module werden in Import-Reihenfolge ausgewertet.
import { config } from "dotenv"

config({ path: [".env.local", ".env"] })
