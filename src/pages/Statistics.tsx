import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainwaveChart, generateMockBrainwaveData } from "@/components/BrainwaveChart";
import { FocusTimeChart } from "@/components/FocusTimeChart";
import { FocusStateChart } from "@/components/FocusStateChart";
import { FocusInsights } from "@/components/FocusInsights";
import { FocusLevel } from "@/components/FocusIndicator";
import { SessionHistoryTable } from "@/components/SessionHistoryTable";
import { useNavigate } from "react-router-dom";

interface SessionData {
  duration: number;
  averageFocusScore: number;
  timestamp: string;
  focusLevel: FocusLevel;
}

const Statistics = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [brainwaveData, setBrainwaveData] = useState(generateMockBrainwaveData(30));

  useEffect(() => {
    // Get the latest session data
    const sessionsString = localStorage.getItem("focusSessions");
    if (sessionsString) {
      const sessions: SessionData[] = JSON.parse(sessionsString);
      if (sessions.length > 0) {
        const latestSession = sessions[sessions.length - 1];
        setSessionData(latestSession);
        
        // Generate appropriate amount of mock data based on session duration
        const minutesStudied = Math.ceil(latestSession.duration / 60);
        setBrainwaveData(generateMockBrainwaveData(minutesStudied));
      }
    }
  }, []);

  // Format duration from seconds to minutes and seconds
  const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  };

  // Get focus assessment based on level
  const getFocusAssessment = (focusLevel: FocusLevel): string => {
    switch (focusLevel) {
      case "high":
        return "Your concentration was excellent throughout this session. Great job maintaining deep focus!";
      case "medium":
        return "You maintained good focus during this session with occasional fluctuations.";
      case "low":
        return "Your focus was limited during this session. Consider minimizing distractions for better results.";
      default:
        return "No focus data available for this session.";
    }
  };

  // Generate mock focus time data
  const generateFocusTimeData = (duration: number) => {
    const data = [];
    const intervalMinutes = Math.max(1, Math.floor(duration / 60 / 10)); // 10 data points max
    
    for (let i = 0; i < duration; i += intervalMinutes * 60) {
      const minutes = Math.floor(i / 60);
      const focus = Math.max(20, Math.min(100, 60 + Math.sin(i / 300) * 25 + Math.random() * 20));
      data.push({
        time: `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`,
        focus: Math.round(focus)
      });
    }
    
    return data;
  };

  // Calculate focus state times (mock data)
  const calculateFocusStates = (duration: number) => {
    const highFocusTime = Math.floor(duration * 0.4); // 40% high focus
    const mediumFocusTime = Math.floor(duration * 0.35); // 35% medium focus  
    const lowFocusTime = duration - highFocusTime - mediumFocusTime; // remaining low focus
    
    return { highFocusTime, mediumFocusTime, lowFocusTime };
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Session Statistics</h1>
        <p className="text-muted-foreground">
          Review your focus performance and brain activity
        </p>
      </div>

      <div className="grid gap-6 max-w-6xl mx-auto">
        {/* Session History Table */}
        <SessionHistoryTable />
        
        {sessionData ? (
          <>
            {/* Basic stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDuration(sessionData.duration)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total study time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sessionData.averageFocusScore}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall concentration level
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Focus Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {sessionData.focusLevel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sessionData.focusLevel === "high" ? "Excellent" : 
                     sessionData.focusLevel === "medium" ? "Good" : "Needs improvement"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Focus time chart */}
            <FocusTimeChart data={generateFocusTimeData(sessionData.duration)} />

            {/* Focus state pie chart and insights */}
            <div className="grid lg:grid-cols-2 gap-6">
              <FocusStateChart 
                {...calculateFocusStates(sessionData.duration)}
              />
              <div>
                <FocusInsights
                  longestFocusStreak={Math.floor(sessionData.duration / 60 * 0.6)}
                  sessionDuration={sessionData.duration}
                  averageFocusScore={sessionData.averageFocusScore}
                />
              </div>
            </div>

            {/* Original assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{getFocusAssessment(sessionData.focusLevel)}</p>
              </CardContent>
            </Card>

            {/* Brainwave chart */}
            <BrainwaveChart data={brainwaveData} />

            {/* Brainwave legend with new colors */}
            <Card className="brain-wave-bg">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Brainwave Legend:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#ff6b6b] mr-2"></div>
                      <span className="text-sm font-medium">Delta Waves</span>
                    </div>
                   
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#4ecdc4] mr-2"></div>
                      <span className="text-sm font-medium">Alpha Waves</span>
                    </div>
                     
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#45b7d1] mr-2"></div>
                      <span className="text-sm font-medium">Beta Waves</span>
                    </div>
                    
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-[#96ceb4] mr-2"></div>
                      <span className="text-sm font-medium">Theta Waves</span>
                    </div>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4">No session data available. Complete a study session first.</p>
              <Button onClick={() => navigate("/lock-in")}>Start a Session</Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4 mt-2">
          <Button variant="outline" onClick={() => navigate("/home")}>
            Về trang chủ
          </Button>
          <Button onClick={() => navigate("/lock-in")}>
            Session mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
