"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminRegister() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [capacity, setCapacity] = useState(50);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, capacity }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            return;
        }

        setSuccess("Registrierung erfolgreich! Bitte bestätige deine E-Mail, bevor du dich einloggst.");
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Registrierung</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

                <input
                    type="email"
                    placeholder="E-Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <input
                    type="number"
                    placeholder="Kapazität des Restaurants"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                    className="border p-2 w-full mb-4 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition"
                >
                    Registrieren
                </button>

                <div className="mt-4 text-center text-sm">
                    <p>Schon ein Konto? <Link href="/admin/login" className="text-blue-500 hover:underline">Hier einloggen</Link></p>
                </div>
            </form>
        </div>
    );
}
