import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FocusIndicator, FocusLevel } from "@/components/FocusIndicator";
import { SessionConfigForm, SessionConfig } from "@/components/SessionConfigForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDevice } from "@/context/DeviceContext";
import { AlertTriangle } from "lucide-react";

const LockInSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDeviceConnected } = useDevice();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [focusScore, setFocusScore] = useState(75);
  const [focusLevel, setFocusLevel] = useState<FocusLevel>("medium");
  const [showConfigForm, setShowConfigForm] = useState(true);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [targetDuration, setTargetDuration] = useState<number>(0);

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

  const handleStartSession = (config: SessionConfig) => {
    if (!isDeviceConnected) {
      toast({
        title: "Device Not Connected",
        description: "Please connect your EEG device first",
        variant: "destructive"
      });
      return;
    }

    setSessionConfig(config);
    setTargetDuration(config.duration * 60); // Convert minutes to seconds
    setShowConfigForm(false);
    setIsActive(true);
    setIsPaused(false);
    toast({
      title: "Session Started",
      description: `"${config.name}" session has begun`,
    });
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
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
      focusLevel,
      sessionName: sessionConfig?.name || "Unnamed Session",
      goals: sessionConfig?.goals || [],
      environment: sessionConfig?.environment || "default",
      targetDuration: targetDuration
    };
    
    const existingSessions = JSON.parse(localStorage.getItem("focusSessions") || "[]");
    existingSessions.push(sessionData);
    localStorage.setItem("focusSessions", JSON.stringify(existingSessions));
    
    // Navigate to statistics page
    navigate("/statistics");
  };

  // Show configuration form before starting session
  if (showConfigForm && isDeviceConnected) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Thiết lập phiên học tập</h1>
          <p className="text-muted-foreground">
            Cấu hình chi tiết cho phiên Lock-In của bạn
          </p>
        </div>
        <SessionConfigForm 
          onStartSession={handleStartSession}
          onCancel={() => navigate("/home")}
        />
      </div>
    );
  }

  if (!isDeviceConnected) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Focus Lock-In Session</h1>
          <p className="text-muted-foreground">
            Connect your EEG device to start monitoring
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                EEG Device Required
              </h3>
              <p className="text-amber-700 mb-4">
                You need to connect your EEG device before starting a focus session.
              </p>
              <Button onClick={() => navigate("/home")} className="w-full">
                Go to Device Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getEnvironmentDisplay = () => {
    const environments: Record<string, { name: string; icon: string }> = {
      default: { name: "Mặc định", icon: "🎯" },
      pomodoro: { name: "Pomodoro", icon: "🍅" },
      nature: { name: "Thiên nhiên", icon: "🌲" },
      ocean: { name: "Bờ biển", icon: "🌊" },
      rain: { name: "Mưa", icon: "🌧️" },
      cafe: { name: "Quán cà phê", icon: "☕" },
      library: { name: "Thư viện", icon: "📚" }
    };
    return environments[sessionConfig?.environment || "default"];
  };

  const progressPercentage = targetDuration > 0 ? (seconds / targetDuration) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{sessionConfig?.name || "Focus Lock-In Session"}</h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <span>{getEnvironmentDisplay().icon} {getEnvironmentDisplay().name}</span>
          {targetDuration > 0 && (
            <span>• Mục tiêu: {Math.floor(targetDuration / 60)} phút</span>
          )}
        </div>
        {sessionConfig?.goals && sessionConfig.goals.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">
              Mục tiêu: {sessionConfig.goals.join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FocusIndicator focusScore={focusScore} focusLevel={focusLevel} />

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold mb-4">{formatTime(seconds)}</div>
            
            {/* Progress bar if target duration is set */}
            {targetDuration > 0 && (
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Tiến độ</span>
                  <span>{Math.min(100, Math.round(progressPercentage))}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-1">
                  Còn lại: {Math.max(0, Math.floor((targetDuration - seconds) / 60))} phút
                </div>
              </div>
            )}

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
