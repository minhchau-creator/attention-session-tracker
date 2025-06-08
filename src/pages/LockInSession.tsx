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
import { AlertTriangle, ArrowLeft } from "lucide-react";

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
  const [money, setMoney] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLowFocusWarning, setShowLowFocusWarning] = useState(false);

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
          
          // Calculate money every 5 minutes (300 seconds)
          if (newSeconds % 300 === 0) {
            const moneyToAdd = focusScore >= 70 ? 50 : focusScore >= 50 ? 30 : 20; // Bonus for high focus
            setMoney(prev => prev + moneyToAdd);
            
            // Save to localStorage for cat collection
            const currentMoney = parseInt(localStorage.getItem("userMoney") || "0");
            localStorage.setItem("userMoney", (currentMoney + moneyToAdd).toString());
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
            setShowLowFocusWarning(false);
          } else if (newScore >= 50) {
            setFocusLevel("medium");
            setShowLowFocusWarning(false);
          } else {
            setFocusLevel("low");
            setShowLowFocusWarning(true);
            setTimeout(() => setShowLowFocusWarning(false), 3000);
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
    setIsFullscreen(true);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
    toast({
      title: isPaused ? "Phiên đã tiếp tục" : "Phiên đã tạm dừng",
      description: isPaused ? "Tiếp tục tập trung" : "Nghỉ ngơi một chút"
    });
  };

  const handleStop = () => {
    if (seconds < 30) {
      toast({
        title: "Phiên quá ngắn",
        description: "Vui lòng học ít nhất 30 giây để tạo thống kê",
        variant: "destructive"
      });
      return;
    }

    setIsFullscreen(false);

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
      <div className="container mx-auto py-8 px-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold mb-2">Thiết lập phiên học tập</h1>
            <p className="text-muted-foreground">
              Cấu hình chi tiết cho phiên Lock-In của bạn
            </p>
          </div>
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
      <div className="container mx-auto py-8 px-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold mb-2">Lock-in</h1>
            <p className="text-muted-foreground">
              Kết nối thiết bị EEG để bắt đầu giám sát
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                Cần thiết bị EEG
              </h3>
              <p className="text-amber-700 mb-4">
                Bạn cần kết nối thiết bị EEG trước khi bắt đầu lock-in.
              </p>
              <Button onClick={() => navigate("/home")} className="w-full">
                Đi đến kết nối thiết bị
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getEnvironmentDisplay = () => {
    const environments: Record<string, { name: string; icon: string; bgImage?: string }> = {
      default: { name: "Mặc định", icon: "🎯" },
      pomodoro: { name: "Pomodoro", icon: "🍅" },
      nature: { name: "Thiên nhiên", icon: "🌲", bgImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" },
      ocean: { name: "Bờ biển", icon: "🌊", bgImage: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" },
      rain: { name: "Mưa", icon: "🌧️", bgImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" },
      cafe: { name: "Quán cà phê", icon: "☕", bgImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" },
      library: { name: "Thư viện", icon: "📚", bgImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" }
    };
    return environments[sessionConfig?.environment || "default"];
  };

  const progressPercentage = targetDuration > 0 ? (seconds / targetDuration) * 100 : 0;

  // Fullscreen timer view
  if (isFullscreen && isActive && !isPaused) {
    const environment = getEnvironmentDisplay();
    const hasBackground = environment.bgImage && sessionConfig?.environment !== "default";

    return (
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
          hasBackground ? '' : 'bg-black'
        }`}
        style={hasBackground ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${environment.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {/* Low Focus Warning */}
        {showLowFocusWarning && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-white text-center animate-pulse">
            <div className="text-4xl mb-2">😾</div>
            <div className="text-lg font-bold">Sen phải tập trung để kiếm tiền nuôi mèo!</div>
            <div className="text-sm">Sen không làm task nữa à?</div>
          </div>
        )}

        {/* Main Timer */}
        <div className="text-center">
          <div className="text-9xl md:text-[12rem] font-mono font-bold text-white mb-8">
            {formatTime(seconds)}
          </div>
          
          {/* Progress bar if target duration is set */}
          {targetDuration > 0 && (
            <div className="w-80 mb-8">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                ></div>
              </div>
              <div className="text-white/80 text-sm mt-2">
                Còn lại: {Math.max(0, Math.floor((targetDuration - seconds) / 60))} phút
              </div>
            </div>
          )}

          {/* Focus Status */}
          <div className="text-white/90 text-xl mb-8">
            Điểm tập trung: {focusScore}% • Tiền: {money} 💰
          </div>
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button
            onClick={handlePause}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ⏸️ Tạm dừng
          </Button>
          <Button
            onClick={handleStop}
            variant="destructive"
            size="lg"
          >
            ⏹️ Kết thúc
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center flex-1">
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

        {/* Money & Todo List */}
        <div className="space-y-4">
          {/* Money Earned */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <div className="space-y-2">
                <div className="text-lg font-semibold">Tiền kiếm được</div>
                <div className="text-3xl font-bold text-primary">{money}</div>
                <div className="text-sm text-muted-foreground">
                  +{focusScore >= 70 ? 50 : focusScore >= 50 ? 30 : 20} 💰 mỗi 5 phút
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
                            setMoney(prev => prev + 10);
                            const currentMoney = parseInt(localStorage.getItem("userMoney") || "0");
                            localStorage.setItem("userMoney", (currentMoney + 10).toString());
                            toast({
                              title: "Hoàn thành công việc!",
                              description: "+10 💰",
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
          <h3 className="font-medium mb-2">Mẹo tập trung:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
            <li>Đặt mục tiêu rõ ràng cho phiên học tập</li>
            <li>Giảm thiểu các yếu tố gây xao nhãng trong môi trường</li>
            <li>Nghỉ ngơi ngắn mỗi 25-30 phút</li>
            <li>Giữ đủ nước để duy trì chức năng nhận thức</li>
            <li>Khi mất tập trung, thử thở sâu trong 30 giây</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LockInSession;
