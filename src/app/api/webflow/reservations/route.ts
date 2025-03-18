import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    const { customer_name, customer_email, date, time, people, restaurant_id } = await request.json();


    if (!customer_name || !customer_email || !date || !time || !people || !restaurant_id) {
        return NextResponse.json(
            { error: 'Alle Felder sind erforderlich' },
            { status: 400 }
        );
    }

    //Überprüfe availability
    const { data: available, error: checkError } = await supabase.rpc('check_availability', { 
        date_param: date,
        people_param: people,
        restaurant_id_param: restaurant_id
    });

    const { error: setError } = await supabase.rpc('set_current_restaurant_id', {
        p_restaurant_id: restaurant_id
    });

    if (checkError) {
        return NextResponse.json(
          { error: checkError.message },
          { status: 500 }
        );
      }
    
    // Falls kein Zeitslot gefunden wurde, Fehler zurückgeben
    if (!available.some((slot: {time : string}) => slot.time === time)) {
    return NextResponse.json(
        { error: "Der gewählte Zeitslot ist nicht mehr verfügbar" },
        { status: 400 }
    );
    }

    //erstellungen der Reservierung
    const { data, error } = await supabase
        .from('reservations')
        .insert({
                customer_name,
                customer_email,
                date,
                time,
                people,
                restaurant_id
        })
        .select();
    
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 401 }
        ); 
    }

    return NextResponse.json(data);
}