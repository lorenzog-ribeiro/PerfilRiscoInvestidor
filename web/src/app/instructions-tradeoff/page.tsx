"use client";
import InstructionsScreen from "@/src/components/instructions/instructions-tradeoff/page";
import { useRouter } from "next/navigation";

export default function InstructionsPage() {
  const router = useRouter();

  return <InstructionsScreen onContinue={() => router.push("/tradeOff")} />;
}
