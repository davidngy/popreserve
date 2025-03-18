import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    const { restaurant_id, date, people } = await request.json();

    if(!restaurant_id || !date || !people) {
        return NextResponse.json(
            { error: 'restaurant_id, date und people sind erforderlich' },
            { status: 400 }
        );
    }

   const { data, error } = await supabase.rpc('check_availability', { 
        date_param: date,
        people_param: people,
        restaurant_id_param: restaurant_id
   });

   
   if(error) {
    return NextResponse.json(
        { error: error.message },
        { status: 500 }
    );
   }

   const { error: setError } = await supabase.rpc('set_current_restaurant_id', {
    p_restaurant_id: restaurant_id
    });

    if (setError) {
        return NextResponse.json(
            { error: "Konfigurationsvariable konnte nicht gesetzt werden" },
            { status: 500 }
        );
    }
      

   return NextResponse.json({ available_times: data.map((d: { time: string }) => d.time) });
}