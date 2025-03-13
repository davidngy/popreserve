import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;

    // 🔹 Admin-User registrieren
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: "http://localhost:3000/admin/login",
        },
    });

    if (authError) {
        return res.status(400).json({ error: `Fehler bei der Registrierung: ${authError.message}` });
    }

    return res.status(201).json({
        message: "Registrierung erfolgreich! Bitte bestätige deine E-Mail, bevor du dich einloggst.",
    });
}
