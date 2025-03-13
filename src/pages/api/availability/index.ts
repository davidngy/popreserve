import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        return handlePost(req, res);
    } else if (req.method === "GET") {
        return handleGet(req, res);
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}

// 🔹 SPEICHERT Verfügbarkeiten
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const { date, time_slots, max_people } = req.body;

    if (!date || !time_slots || !max_people) {
        return res.status(400).json({ error: "Fehlende Parameter: date, time_slots, max_people." });
    }

    // 🔹 Holt das Access-Token aus den Cookies
    const token = req.headers.cookie?.split("; ").find(row => row.startsWith("sb-access-token="))?.split("=")[1];

    if (!token) {
        return res.status(401).json({ error: "Kein Authentifizierungs-Token gefunden." });
    }

    // 🔹 Benutzer über das Token identifizieren
    const { data: user, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user?.user) {
        console.error("❌ Fehler beim Abrufen des Users:", userError?.message);
        return res.status(401).json({ error: "Nicht authentifiziert." });
    }

    const user_id = user.user.id;

    // 🔹 Restaurant-ID des eingeloggten Users abrufen
    const { data: userRestaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user_id) // Vergleicht den User mit der Restaurant-Tabelle
        .single();

    if (restaurantError || !userRestaurant) {
        console.error("❌ Kein zugehöriges Restaurant gefunden.");
        return res.status(400).json({ error: "Kein zugehöriges Restaurant gefunden." });
    }

    const restaurant_id = userRestaurant.id;

    // 🔹 Neue Verfügbarkeiten speichern
    const { error: insertError } = await supabase
        .from("availability")
        .insert([{ restaurant_id, date, time_slots, max_people, current_people: 0 }]);

    if (insertError) {
        console.error("❌ Fehler beim Einfügen der Verfügbarkeit:", insertError.message);
        return res.status(500).json({ error: "Fehler beim Speichern der Verfügbarkeiten: " + insertError.message });
    }

    return res.status(201).json({ message: "Verfügbarkeiten erfolgreich gespeichert." });
}

// 🔹 HOLT alle Verfügbarkeiten für ein Restaurant
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const restaurant_id = req.query.restaurant_id as string;

    if (!restaurant_id) {
        return res.status(400).json({ error: "Fehlender Parameter: restaurant_id" });
    }

    try {
        const { data, error } = await supabase
            .from("availability")
            .select("*")
            .eq("restaurant_id", restaurant_id);

        if (error) {
            console.error("🔴 Fehler beim Abrufen der Verfügbarkeiten:", error.message);
            return res.status(500).json({ error: "Fehler beim Abrufen der Verfügbarkeiten: " + error.message });
        }

        return res.status(200).json({ availability: data });
    } catch (error) {
        console.error("🔴 Unerwarteter Fehler:", error);
        return res.status(500).json({ error: "Interner Serverfehler" });
    }
}
