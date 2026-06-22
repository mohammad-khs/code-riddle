import { redirect } from "next/navigation";

export default function CreatorDashboardIndex() {
  redirect("/creator/dashboard/manage-solver");
}
