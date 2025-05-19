
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FocusIndicator, FocusLevel } from "@/components/FocusIndicator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LockInSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusScore, setFocusScore] = useState(75);
  const [focusLevel, setFocusLevel] = useState<FocusLevel>("medium");

  // Format time as mm:ss
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Random fluctuation in focus score to simulate real-time changes
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setSeconds((seconds) => seconds + 1);
        
        // Simulate focus changes
        if (seconds % 30 === 0) {
          const newScore = Math.max(30, Math.min(100, focusScore + (Math.random() * 20 - 10)));
          setFocusScore(Math.round(newScore));
          
          // Update focus level based on new score
          if (newScore >= 80) {
            setFocusLevel("high");
          } else if (newScore >= 50) {
            setFocusLevel("medium");
          } else {
            setFocusLevel("low");
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds, focusScore]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast({
      title: "Session Started",
      description: "Your focus session has begun"
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Session Resumed" : "Session Paused",
      description: isPaused ? "Continue focusing" : "Take a short break"
    });
  };

  const handleStop = () => {
    if (seconds < 30) {
      toast({
        title: "Session too short",
        description: "Please study for at least 30 seconds to generate statistics",
        variant: "destructive"
      });
      return;
    }

    // Save session data in local storage for statistics page
    const sessionData = {
      duration: seconds,
      averageFocusScore: focusScore,
      timestamp: new Date().toISOString(),
      focusLevel
    };
    
    const existingSessions = JSON.parse(localStorage.getItem("focusSessions") || "[]");
    existingSessions.push(sessionData);
    localStorage.setItem("focusSessions", JSON.stringify(existingSessions));
    
    // Navigate to statistics page
    navigate("/statistics");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Focus Lock-In Session</h1>
        <p className="text-muted-foreground">
          Maintain your focus and monitor your attention levels
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FocusIndicator focusScore={focusScore} focusLevel={focusLevel} />

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold mb-8">{formatTime(seconds)}</div>
            <div className="grid grid-cols-2 gap-4 w-full">
              {!isActive ? (
                <Button onClick={handleStart} size="lg" className="w-full">
                  Start Studying
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {isPaused ? "Continue" : "Pause"}
                  </Button>
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                  >
                    Stop Session
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-medium mb-2">Focus Tips:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
            <li>Set clear goals for your study session</li>
            <li>Minimize external distractions in your environment</li>
            <li>Take short breaks every 25-30 minutes</li>
            <li>Stay hydrated to maintain cognitive function</li>
            <li>When focus drops, try deep breathing for 30 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LockInSession;
