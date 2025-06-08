
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthForms } from "@/components/AuthForms";
import { UserSurvey } from "@/components/UserSurvey";
import { SurveyResults } from "@/components/SurveyResults";
import { useAuth } from "@/context/AuthContext";

interface SurveyData {
  maxFocusTime: number;
  wantToChange: string;
  distractionFactors: string[];
}

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"survey" | "results" | "auth">("auth");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const stepParam = urlParams.get("step");
    
    if (stepParam === "survey" && user) {
      setStep("survey");
    } else {
      // Check if user has already completed survey
      const savedSurvey = localStorage.getItem("userSurvey");
      if (savedSurvey && !user) {
        setStep("auth");
      } else if (!savedSurvey && user) {
        setStep("survey");
      } else {
        setStep("auth");
      }
    }
  }, [location, user]);

  const handleSurveyComplete = (data: SurveyData) => {
    setSurveyData(data);
    setStep("results");
  };

  const handleResultsContinue = () => {
    if (user) {
      navigate("/home");
    } else {
      setStep("auth");
    }
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
