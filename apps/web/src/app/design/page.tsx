import type { Metadata } from "next";
import { farmaciaHours, getOpenStatus } from "@masera/core";
import { DesignSystem } from "./DesignSystem";

export const metadata: Metadata = { title: "Componenti" };
export const dynamic = "force-dynamic";

export default function DesignPage() {
  return <DesignSystem initialOpen={getOpenStatus(farmaciaHours, new Date())} />;
}
