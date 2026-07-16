import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export function AdminLogin({ onLogin }: { onLogin: (token: string, admin: { name: string; email: string; picture?: string }) => void }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-600 font-semibold mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Sign in to host a quiz</h1>
        <p className="text-sm text-gray-500 mb-8">Google sign-in is required to create rooms and manage question templates.</p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError(null);
              const idToken = credentialResponse.credential;
              if (!idToken) {
                setError("Google didn't return a token — try again.");
                return;
              }
              try {
                const res = await fetch(`${API_URL}/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ idToken }),
                });
                if (!res.ok) throw new Error("Sign-in failed");
                const data = await res.json();
                onLogin(data.token, data.admin);
              } catch {
                setError("Couldn't sign in — please try again.");
              }
            }}
            onError={() => setError("Google sign-in failed.")}
          />
        </div>

        {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
      </div>
    </div>
  );
}