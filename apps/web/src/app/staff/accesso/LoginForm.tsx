"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="pw" className="block text-[16px] font-semibold">
          Password del personale
        </label>
        <input
          id="pw"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!state?.error}
          aria-describedby={state?.error ? "pw-e" : undefined}
          className="fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]"
        />
        {state?.error && (
          <p id="pw-e" role="alert" className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className="fm-focus fm-press min-h-12 w-full rounded-full bg-verde-scuro text-[17px] font-bold text-carta disabled:opacity-60">
        {pending ? "Controllo…" : "Entra"}
      </button>
      <p className="text-[14px] text-verde">Usa la tua password: farmacia o Farmaestetica. Su questo computer resti dentro per 30 giorni.</p>
    </form>
  );
}
