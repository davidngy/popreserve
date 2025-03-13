type Reservation = {
    id: string;
    name: string;
    date: string;
    time: string;
    people_count: number;
};

interface ReservationTableProps {
    reservations: Reservation[];
}


export default function ReservationTable({ reservations }: ReservationTableProps) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Datum</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Uhrzeit</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Personen</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{res.name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(res.date).toLocaleDateString('de-DE')} {/* Datumsformatierung */}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{res.time}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{res.people_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }