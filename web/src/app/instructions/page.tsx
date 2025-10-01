"use client";
import InstructionsScreen from "@/src/components/instructions/initial-instructions/page";
import { useRouter } from "next/navigation";


export default function InstructionsPage() {
  const router = useRouter();
  
  return (
    <InstructionsScreen 
      onContinue={() => router.push('/quiz')}
    />
  );
}