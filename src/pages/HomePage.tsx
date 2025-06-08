
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceConnection } from "@/components/DeviceConnection";
import { RealtimeBrainwaveChart } from "@/components/RealtimeBrainwaveChart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "User"}</h1>
        <p className="text-muted-foreground">
          Track and improve your focus with neurofeedback
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <DeviceConnection />

        <Card className="connection-card overflow-hidden">
          <div className="h-2 w-full bg-primary"></div>
          <CardHeader>
            <CardTitle>Lock-In Session</CardTitle>
            <CardDescription>
              Start a focused study session with EEG monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-primary mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold">Focus</div>
                <div className="text-xs mt-1">Start Session</div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/lock-in")} 
              className="w-full"
            >
              Begin Lock-In
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Brainwave Chart */}
      <div className="max-w-6xl mx-auto mt-8">
        <RealtimeBrainwaveChart />
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-6 rounded-lg brain-wave-bg">
        <h2 className="text-2xl font-semibold mb-4">
          Understanding Neurofeedback
        </h2>
        <div className="space-y-4">
          <p>
            Neurofeedback is a type of biofeedback that uses real-time displays of brain activity to teach self-regulation of brain function.
          </p>
          <p>
            By monitoring your brainwaves during study sessions, you can:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Identify when your focus is highest</li>
            <li>Recognize patterns that lead to distraction</li>
            <li>Train your brain to maintain optimal study states</li>
            <li>Improve your studying efficiency over time</li>
          </ul>
          <p className="font-medium">
            Connect your EEG device and start a Lock-In session to begin monitoring your brain activity during study.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
