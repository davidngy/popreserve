import { redirect } from "next/navigation";


export default function Home() {
  redirect("/admin/login"); // Redirect root to /admin
}
