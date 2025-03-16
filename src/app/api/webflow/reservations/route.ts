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
    const { data: availability, error: availabilityError } = await supabase
        .from('availability')
        .select('*')
        .eq('restaurant_id', restaurant_id)
        .eq('date', date)
        .eq('time', time)
        .single();
    
    if (availabilityError || !availability) {
        return NextResponse.json(
            { error: 'Keine Verfügbarkeit gefunden' },
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
    
    
    
    
    const { error: setError } = await supabase.rpc('set_current_restaurant_id', {
        p_restaurant_id: restaurant_id
      });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 401 }
        ); 
    }

    return NextResponse.json(data);
}