import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FocusLevel } from "@/components/FocusIndicator";
import { SessionConfigForm, SessionConfig } from "@/components/SessionConfigForm";
import { RealtimeBrainwaveChart } from "@/components/RealtimeBrainwaveChart";
import { RewardSystem } from "@/components/RewardSystem";
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
  const [completedTodos, setCompletedTodos] = useState<boolean[]>([]);
  const [foodPellets, setFoodPellets] = useState<number>(0);

  // Format time as mm:ss
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Random fluctuation in focus score and calculate food pellets
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          
          // Calculate food pellets every 5 minutes (300 seconds)
          if (newSeconds % 300 === 0) {
            const pelletsToAdd = focusScore >= 70 ? 30 : focusScore >= 50 ? 15 : 10; // Bonus for high focus
            setFoodPellets(prev => prev + pelletsToAdd);
          }
          
          return newSeconds;
        });
        
        // Simulate focus changes every 30 seconds
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

  // Initialize todo list completion status
  useEffect(() => {
    if (sessionConfig?.todoList) {
      setCompletedTodos(new Array(sessionConfig.todoList.length).fill(false));
    }
  }, [sessionConfig]);

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

      {/* Main Focus Interface */}
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Timer and Controls - Main Display */}
        <Card className="lg:col-span-2">
          <CardContent className="p-8">
            {/* Focus Status Banner */}
            <div className={`text-center p-4 rounded-lg mb-6 ${
              focusLevel === "high" ? "bg-green-100 text-green-800 border-2 border-green-300" :
              focusLevel === "medium" ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300" :
              "bg-red-100 text-red-800 border-2 border-red-300"
            }`}>
              <div className="flex items-center justify-center gap-3">
                <div className="text-2xl">
                  {focusLevel === "high" ? "🎯" : focusLevel === "medium" ? "⚡" : "⚠️"}
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {focusLevel === "high" ? "Tập trung cao" : focusLevel === "medium" ? "Tập trung trung bình" : "Cần tập trung hơn"}
                  </div>
                  <div className="text-sm">Điểm số: {focusScore}%</div>
                </div>
              </div>
            </div>

            {/* Large Timer Display */}
            <div className="text-center mb-6">
              <div className="text-8xl font-mono font-bold text-primary mb-2">{formatTime(seconds)}</div>
              <div className="text-lg text-muted-foreground">
                {isActive ? (isPaused ? "Đã tạm dừng" : "Đang học tập") : "Sẵn sàng bắt đầu"}
              </div>
            </div>
            
            {/* Progress bar if target duration is set */}
            {targetDuration > 0 && (
              <div className="w-full mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Tiến độ</span>
                  <span>{Math.min(100, Math.round(progressPercentage))}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Còn lại: {Math.max(0, Math.floor((targetDuration - seconds) / 60))} phút
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button onClick={handleStart} size="lg" className="px-12 py-4 text-xl">
                  🚀 Bắt đầu học
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    {isPaused ? "▶️ Tiếp tục" : "⏸️ Tạm dừng"}
                  </Button>
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    ⏹️ Kết thúc
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Food Pellets & Todo List */}
        <div className="space-y-4">
          {/* Food Pellets Earned */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🍖</div>
              <div className="space-y-2">
                <div className="text-lg font-semibold">Hạt thức ăn kiếm được</div>
                <div className="text-3xl font-bold text-primary">{foodPellets}</div>
                <div className="text-sm text-muted-foreground">
                  +{focusScore >= 70 ? 30 : focusScore >= 50 ? 15 : 10} hạt mỗi 5 phút
                </div>
                {focusScore >= 70 && (
                  <div className="text-xs text-green-600 font-medium">Bonus tập trung cao!</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Todo List */}
          {sessionConfig?.todoList && sessionConfig.todoList.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">📝 Danh sách công việc</h3>
                <div className="space-y-2">
                  {sessionConfig.todoList.map((todo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={completedTodos[index] || false}
                        onChange={(e) => {
                          const newCompleted = [...completedTodos];
                          newCompleted[index] = e.target.checked;
                          setCompletedTodos(newCompleted);
                          
                          if (e.target.checked) {
                            setFoodPellets(prev => prev + 5);
                            toast({
                              title: "Hoàn thành công việc!",
                              description: "+5 hạt thức ăn",
                            });
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className={`text-sm ${completedTodos[index] ? 'line-through text-muted-foreground' : ''}`}>
                        {todo}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Hoàn thành: {completedTodos.filter(Boolean).length}/{sessionConfig.todoList.length}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
