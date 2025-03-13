import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { restaurant_id, name, email, phone, date, time, people_count } = req.body;

    // Debug-Log
    console.log("🔍 Eingegangene restaurant_id:", restaurant_id, "Typ:", typeof restaurant_id);

    // Nachher (Lösung)
    const parsedRestaurantId = BigInt(restaurant_id); // Explizite BigInt-Konvertierung
    console.log("🔢 BigInt-Wert:", parsedRestaurantId.toString());
    if (Number.isNaN(Number(parsedRestaurantId))) {
        return res.status(400).json({ error: "Ungültige Restaurant-ID!" });
    }

    try {
        // ✅ Korrekte Abfrage mit BigInt-String-Konvertierung
        const { data: restaurant, error: restaurantError } = await supabase
            .from("restaurants")
            .select("*")
            .eq("id", parsedRestaurantId.toString()) // Explizit als String senden
            .single();

        console.log("🔍 Supabase Response (Restaurant):", { data: restaurant, error: restaurantError });

        if (restaurantError || !restaurant) {
            console.error("❌ Supabase Fehlerdetails:", restaurantError);
            return res.status(400).json({ error: "Restaurant nicht gefunden!" });
        }

        // 🔽 Neue Reservierung einfügen
        const { data: reservation, error: reservationError } = await supabase
            .from("reservations")
            .insert([
                {
                    restaurant_id: parsedRestaurantId.toString(), // Als String speichern
                    name,
                    email,
                    phone,
                    date,
                    time,
                    people_count,
                },
            ])
            .select(); // Gibt die eingefügte Zeile zurück

        console.log("🔍 Supabase Response (Reservierung):", { data: reservation, error: reservationError });

        if (reservationError) {
            console.error("❌ Fehler beim Einfügen der Reservierung:", reservationError);
            return res.status(500).json({ error: "Fehler beim Erstellen der Reservierung!" });
        }

        return res.status(201).json({ message: "Reservierung erfolgreich!", reservation });

    } catch (error) {
        console.error("❌ Unerwarteter Fehler:", error);
        return res.status(500).json({ error: "Serverfehler!" });
    }
}