"use client";

import { useParams } from "next/navigation";
import DashboardSection from "../../../src/components/DashboardSection";

export default function DashboardNestedPage() {
  const params = useParams();

  return <DashboardSection slug={params.section} />;
}
