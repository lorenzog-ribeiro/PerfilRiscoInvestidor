"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner"

import StepOne from "@/components/profile-steps/profile-step-one/page";
import StepTwo from "@/components/profile-steps/profile-step-two/page";
import StepThree from "@/components/profile-steps/profile-step-three/page";
import StepFour from "@/components/profile-steps/profile-step-four/page";
import StepFive from "@/components/profile-steps/profile-step-five/page";
import StepSix from "@/components/profile-steps/profile-step-six/page";
import StepSeven from "@/components/profile-steps/profile-step-seven/page";

export default function Home() {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        birthDate: "",
        gender: "",
        maritalStatus: "",
        hasFinanceExperience: "",
        financialStatus: "",
        incomeRange: "",
        educationLevel: "",
    });

    const isStepValid = () => {
        if (step === 1) return formData.birthDate;
        if (step === 2) return formData.gender;
        if (step === 3) return formData.maritalStatus;
        if (step === 4) return formData.educationLevel;
        if (step === 5) return formData.financialStatus;
        if (step === 6) return formData.incomeRange;
        if (step === 7) return formData.hasFinanceExperience;
        return true;
    };

    const handleNext = () => {
        if (isStepValid()) {
            setStep((prev) => Math.min(prev + 1, 7));
        } else {
            toast.warning("Preencha todos os campos obrigatórios!");
        }
    };

    const progress = (step / 7) * 100;
    const getGradientColor = () => {
        if (progress <= 20) return "from-red-500 to-orange-400";
        if (progress <= 40) return "from-orange-400 to-orange-400";
        if (progress <= 60) return "from-orange-400 to-orange-400";
        if (progress <= 80) return "from-orange-400 to-orange-400";
        if (progress <= 100) return "from-orange-400 to-orange-400";
        return "from-orange-400 to-green-300";
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow space-y-8">
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 bg-gradient-to-r ${getGradientColor()}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {step === 1 && <StepOne formData={formData} setFormData={setFormData} />}
                {step === 2 && <StepTwo formData={formData} setFormData={setFormData} />}
                {step === 3 && <StepThree formData={formData} setFormData={setFormData} />}
                {step === 4 && <StepFour formData={formData} setFormData={setFormData} />}
                {step === 5 && <StepFive formData={formData} setFormData={setFormData} />}
                {step === 6 && <StepSix formData={formData} setFormData={setFormData} />}
                {step === 7 && <StepSeven formData={formData} setFormData={setFormData} />}

                <div className="flex justify-between pt-4">
                    <Button
                        onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                        className="bg-gray-300 hover:bg-gray-400 text-black"
                        disabled={step === 1}
                    >
                        Voltar
                    </Button>
                    <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
                        {step === 7 ? "Finalizar" : "Continuar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
