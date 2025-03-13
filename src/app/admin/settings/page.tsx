"use client";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [date, setDate] = useState<string>("");
    const [times, setTimes] = useState<string[]>(["18:00", "19:00", "20:00"]);
    const [maxPeople, setMaxPeople] = useState<number>(10);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const storedRestaurantId = localStorage.getItem("restaurant_id");
        if (storedRestaurantId) {
            setRestaurantId(storedRestaurantId);
            fetchAvailability(storedRestaurantId);
        }
    }, []);

    async function fetchAvailability(restaurantId: string | null) {
        if (!restaurantId) {
            console.error("❌ Kein restaurant_id gefunden, GET-Request abgebrochen.");
            return;
        }

        try {
            const response = await fetch(`/api/availability?restaurant_id=${restaurantId}`);

            if (!response.ok) {
                console.error("❌ Fehler beim Abrufen der Verfügbarkeiten:", response.statusText);
                return;
            }

            const data = await response.json();

            if (data.availability.length > 0) {
                setDate(data.availability[0].date);
                setTimes(data.availability[0].time_slots ?? ["18:00", "19:00", "20:00"]); // Falls `time_slots` leer ist, setze Standardwerte
                setMaxPeople(data.availability[0].max_people ?? 10);
            }
        } catch (error) {
            console.error("❌ API-Fehler:", error);
        }
    }

    async function handleSaveAvailability() {
        if (!restaurantId) {
            setMessage("Fehler: Restaurant-ID nicht gefunden.");
            console.error("❌ Kein restaurant_id gefunden!");
            return;
        }

        if (!date) {
            setMessage("Fehler: Bitte ein Datum auswählen.");
            console.error("❌ Kein Datum ausgewählt!");
            return;
        }

        if (!times || times.length === 0) {
            setMessage("Fehler: Bitte mindestens eine Zeit hinzufügen.");
            console.error("❌ Keine Zeit-Slots gesetzt!");
            return;
        }

        const payload = {
            restaurant_id: restaurantId,
            date,
            time_slots: times,
            max_people: maxPeople
        };

        console.log("📡 Sende Daten an API:", payload); // 🟢 Debugging: Logge die gesendeten Daten

        try {
            const response = await fetch("/api/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Verfügbarkeit erfolgreich gespeichert!");
            } else {
                setMessage("❌ Fehler: " + data.error);
            }
        } catch (error) {
            console.error("❌ Fehler beim Speichern:", error);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Verfügbarkeiten einstellen</h1>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 mb-2" />
            <input type="number" value={maxPeople} onChange={(e) => setMaxPeople(parseInt(e.target.value))} className="border p-2 mb-2" />
            <button onClick={handleSaveAvailability} className="bg-blue-500 text-white px-4 py-2 rounded">Speichern</button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}
