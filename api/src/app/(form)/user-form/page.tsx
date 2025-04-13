'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import StepOne from '@/components/step-one/page';
import StepThree from '@/components/step-three/page';
import StepTwo from '@/components/step-two/page';

export default function Home() {
    const [step, setStep] = useState(1);
  
    const [formData, setFormData] = useState({
      birthDate: '',
      age: '',
      gender: '',
      maritalStatus: '',
      financialStatus: '',
      incomeRange: '',
      educationLevel: '',
      hasFinanceExperience: '',
    });
  
    const isStepValid = () => {
      if (step === 1) {
        return (
          formData.birthDate &&
          formData.age &&
          formData.gender &&
          formData.maritalStatus
        );
      }
      if (step === 2) {
        return (
          formData.financialStatus &&
          formData.incomeRange &&
          formData.educationLevel
        );
      }
      return true;
    };
  
    const handleNext = () => {
      if (isStepValid()) {
        setStep((prev) => Math.min(prev + 1, 3));
      } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
      }
    };
  
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#f1f5f9]">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow space-y-8">
          <div className="flex items-center justify-center space-x-4">
            <span className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-300'}`}></span>
            <span className={`flex-1 h-[2px] ${step >= 2 ? 'bg-black' : 'bg-gray-300'}`}></span>
            <span className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-300'}`}></span>
            <span className={`flex-1 h-[2px] ${step === 3 ? 'bg-black' : 'bg-gray-300'}`}></span>
            <span className={`w-4 h-4 rounded-full ${step === 3 ? 'bg-black' : 'bg-gray-300'}`}></span>
          </div>
  
          {step === 1 && <StepOne formData={formData} setFormData={setFormData} />}
          {step === 2 && <StepTwo formData={formData} setFormData={setFormData} />}
          {step === 3 && <StepThree formData={formData} setFormData={setFormData} />}
  
          <div className="flex justify-between pt-4">
            {step > 1 && <Button onClick={handleBack} variant="outline">Voltar</Button>}
            <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
              {step === 3 ? 'Finalizar' : 'Continuar'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
