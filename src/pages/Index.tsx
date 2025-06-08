
import React, { useState, useEffect } from "react";
import { AuthForms } from "@/components/AuthForms";
import { UserSurvey } from "@/components/UserSurvey";
import { SurveyResults } from "@/components/SurveyResults";

interface SurveyData {
  maxFocusTime: number;
  wantToChange: string;
  distractionFactors: string[];
}

const Index = () => {
  const [step, setStep] = useState<"survey" | "results" | "auth">("survey");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);

  useEffect(() => {
    // Check if user has already completed survey
    const savedSurvey = localStorage.getItem("userSurvey");
    if (savedSurvey) {
      setStep("auth");
    }
  }, []);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStep("results");
  };

  const handleResultsContinue = () => {
    setStep("auth");
  };

  if (step === "survey") {
    return <UserSurvey onComplete={handleSurveyComplete} />;
  }

  if (step === "results" && surveyData) {
    return <SurveyResults surveyData={surveyData} onContinue={handleResultsContinue} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <AuthForms />
      </div>
    </div>
  );
};

export default Index;
