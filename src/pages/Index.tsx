
import React from "react";
import { AuthForms } from "@/components/AuthForms";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <AuthForms />
      </div>
    </div>
  );
};

export default Index;
