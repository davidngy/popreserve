import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminNavbar() {
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/admin/login");
    }

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between">
            <h1 className="text-xl">PopReserve Admin</h1>
            <div className="flex gap-4">
                <Link href="/admin">Reservierungen</Link>
                <Link href="/admin/settings">Einstellungen</Link>
                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </div>
        </nav>
    );
}
