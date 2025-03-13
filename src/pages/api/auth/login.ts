import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { email, password } = req.body;

    console.log("🔹 Login-Versuch für:", email);

    // 🔹 Supabase Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.session) {
        console.error("🔴 Supabase Login-Fehler:", authError?.message);
        return res.status(401).json({ error: "Ungültige Anmeldedaten!" });
    }

    const user_id = authData.user?.id;
    if (!user_id) {
        return res.status(400).json({ error: "Fehler: User-ID konnte nicht abgerufen werden." });
    }

    console.log("✅ Login erfolgreich für:", user_id);

    // 🔹 Prüfen, ob das Restaurant existiert
    const { data: userRestaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user_id)
        .single();

    let restaurant_id;

    if (restaurantError || !userRestaurant) {
        console.log("⚡ Erstelle neues Restaurant für:", user_id);

        // 🔹 Neues Restaurant erstellen
        const { data: newRestaurant, error: createError } = await supabase
            .from("restaurants")
            .insert([{ user_id, email, capacity: 50 }])
            .select()
            .single();

        if (createError) {
            console.error("❌ Fehler beim Erstellen des Restaurants:", createError.message);
            return res.status(500).json({ error: "Fehler beim Erstellen des Restaurants: " + createError.message });
        }

        restaurant_id = newRestaurant.id;
        console.log("✅ Neues Restaurant erstellt mit ID:", restaurant_id);
    } else {
        console.log("🔹 Restaurant bereits vorhanden für:", user_id);
        restaurant_id = userRestaurant.id;
    }

    // 🔹 Token setzen
    res.setHeader("Set-Cookie", `sb-access-token=${authData.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`);

    return res.status(200).json({
        message: "Login erfolgreich",
        restaurant_id,
        access_token: authData.session.access_token, // Falls Frontend den Token braucht
    });
}
