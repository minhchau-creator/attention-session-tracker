
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type FocusLevel = "high" | "medium" | "low";

interface FocusIndicatorProps {
  focusScore: number;
  focusLevel: FocusLevel;
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ focusScore, focusLevel }) => {
  const getFocusLevelText = (): string => {
    switch (focusLevel) {
      case "high":
        return "High Focus";
      case "medium":
        return "Medium Focus";
      case "low":
        return "Low Focus";
      default:
        return "No Data";
    }
  };

  const getFocusLevelDescription = (): string => {
    switch (focusLevel) {
      case "high":
        return "Great job! You're deeply focused.";
      case "medium":
        return "Good concentration level.";
      case "low":
        return "Try to minimize distractions.";
      default:
        return "Connect your device to start monitoring.";
    }
  };

  const getFocusLevelClass = (): string => {
    switch (focusLevel) {
      case "high":
        return "focus-high";
      case "medium":
        return "focus-medium";
      case "low":
        return "focus-low";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Current Focus Level</span>
          <span className={`text-lg px-3 py-1 rounded-full text-white ${getFocusLevelClass()}`}>
            {getFocusLevelText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Focus Score</span>
            <span className="font-medium">{focusScore}%</span>
          </div>
          <Progress value={focusScore} className={`h-2 ${getFocusLevelClass()}`} />
        </div>
        <p className="text-sm text-muted-foreground">{getFocusLevelDescription()}</p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-focus-low mb-1"></div>
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-focus-medium mb-1"></div>
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-focus-high mb-1"></div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
