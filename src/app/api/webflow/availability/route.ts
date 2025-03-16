import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const restaurant_id = searchParams.get('restaurant_id');
    const date = searchParams.get('date');
    const people = parseInt(searchParams.get('people') || '1');

    // Überprüfe, ob alle erforderlichen Parameter vorhanden sind
    if (!restaurant_id || !date || !people) {
        return NextResponse.json(
            { error: 'restaurant_id, date und people sind erforderlich' },
            { status: 400 }
        );
    }

    // Setze die Konfigurationsvariable
    const { error: setError } = await supabase.rpc('set_current_restaurant_id', {
        p_restaurant_id: restaurant_id
    });

    if (setError) {
        return NextResponse.json(
            { error: 'Konfigurationsvariable konnte nicht gesetzt werden' },
            { status: 500 }
        );
    }

    // Verfügbarkeit prüfen
    const { data, error } = await supabase.rpc('check_availability', {
        date_param: date,
        people_param: people,
        restaurant_id_param: restaurant_id
    });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}