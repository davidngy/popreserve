"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";
import ReservationTable from "@/components/ReservationTable";
import { Reservation } from "../types/index"; // Korrekter Import

export default function AdminDashboard() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // Cleanup-Flag
        setLoading(true);

        const fetchReservations = async () => {
            const { data, error } = await supabase
                .from("reservations")
                .select("*")
                .order("date", { ascending: false }); // Sortierung hinzufügen

            if (!isMounted) return;

            if (error) {
                setError("Fehler beim Laden der Reservierungen: " + error.message);
                setLoading(false);
                return;
            }

            // Konvertiere BigInt-IDs zu Strings
            const formattedData = data?.map((res) => ({
                ...res,
                id: res.id.toString(), // Sicherheitskonvertierung
            })) as Reservation[];

            setReservations(formattedData || []);
            setLoading(false);
        };

        fetchReservations();

        return () => {
            isMounted = false; // Cleanup
        };
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <AdminNavbar />
                <div className="text-center py-8">Lade Reservierungen...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <AdminNavbar />
                <div className="text-red-500 py-8">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <AdminNavbar />
            <h1 className="text-3xl mb-4">Reservierungsübersicht</h1>
            <ReservationTable reservations={reservations} />
        </div>
    );
}