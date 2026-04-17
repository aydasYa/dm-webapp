import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-card-foreground">Anmelden</h1>
          <p className="text-sm text-muted-foreground">Melde dich mit deinem Account an</p>
        </div>

        <form className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@firma.de"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            formAction={login}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            Anmelden
          </button>

        </form>
      </div>
    </div>
  )
}

/*

-- Admin user
INSERT INTO users (id, "supabaseId", email, firstname, lastname, role, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  '1b0d2f6f-a75c-4264-abb6-5c6b3cb30ac0',
  'admin@test.com',
  'Admin',
  'User',
  'ADMIN',
  'ACTIVE',
  now(),
  now()
);

-- Tow truck driver user
INSERT INTO users (id, "supabaseId", email, firstname, lastname, role, status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  '55faaa4e-e6b3-4160-8388-a3297b661ba3',
  'driver@test.com',
  'Max',
  'Mustermann',
  'TOW_TRUCK_DRIVER',
  'ACTIVE',
  now(),
  now()
);




*/