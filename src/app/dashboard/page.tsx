import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth session fetch failed:", e);
  }

  if (!session) {
    redirect("/login");
  }

  return <DashboardContent user={session.user} />;
}
