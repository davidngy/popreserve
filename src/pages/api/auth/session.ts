import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

    const token = req.cookies["sb-access-token"];

    if (!token) {
        return res.status(401).json({ error: "Nicht eingeloggt" });
    }

    // 🔹 Prüfen, ob der User eingeloggt ist
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Ungültige Sitzung" });
    }

    // 🔹 Restaurant-ID für den User abrufen
    const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

    return res.status(200).json({ user: data.user, restaurant_id: restaurant?.id });
}
