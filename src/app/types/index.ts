export type Reservation = {
    id: string;
    name: string;
    date: string;
    time: string;
    people_count: number;
    restaurant_id?: string;
    phone?: string;
    email?: string;
  };