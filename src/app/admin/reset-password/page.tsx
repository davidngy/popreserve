"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setError("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:3000/admin/update-password"
        });

        if (error) {
            setError("Fehler beim Zurücksetzen: " + error.message);
            return;
        }

        setMessage("Passwort-Reset-Link wurde gesendet! Überprüfe deine E-Mails.");
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleReset} className="bg-white p-6 shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-semibold mb-4 text-center">Passwort zurücksetzen</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

                <input
                    type="email"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                    required
                />
                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded w-full hover:bg-yellow-600 transition">
                    Passwort zurücksetzen
                </button>
            </form>
        </div>
    );
}
