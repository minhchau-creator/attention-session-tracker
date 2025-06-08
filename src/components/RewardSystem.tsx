import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RewardSystemProps {
  focusTimeMinutes: number;
  isActive: boolean;
}

export const RewardSystem: React.FC<RewardSystemProps> = ({ focusTimeMinutes, isActive }) => {
  const [rewardType, setRewardType] = useState<"cat" | "plant">("cat");
  const [level, setLevel] = useState(1);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  // Load saved progress
  useEffect(() => {
    const savedReward = localStorage.getItem("rewardProgress");
    if (savedReward) {
      const progress = JSON.parse(savedReward);
      setRewardType(progress.type || "cat");
      setLevel(progress.level || 1);
      setTotalFocusTime(progress.totalTime || 0);
    }
  }, []);

  // Update progress when focus time changes
  useEffect(() => {
    const newTotalTime = totalFocusTime + (isActive ? focusTimeMinutes : 0);
    const newLevel = Math.floor(newTotalTime / 30) + 1; // Level up every 30 minutes
    
    if (newLevel > level) {
      setLevel(newLevel);
    }
    
    setTotalFocusTime(newTotalTime);
    
    // Save progress
    localStorage.setItem("rewardProgress", JSON.stringify({
      type: rewardType,
      level: newLevel,
      totalTime: newTotalTime
    }));
  }, [focusTimeMinutes, isActive]);

  const getRewardDisplay = () => {
    if (rewardType === "cat") {
      const stages = ["🐱", "🐾", "😸", "😻", "🦁"];
      return {
        emoji: stages[Math.min(level - 1, stages.length - 1)],
        name: level <= 1 ? "Mèo con" : level <= 2 ? "Mèo trưởng thành" : level <= 3 ? "Mèo vui vẻ" : level <= 4 ? "Mèo hạnh phúc" : "Vua sư tử",
        description: level <= 1 ? "Còn nhỏ và cần chăm sóc" : level <= 2 ? "Đang lớn khôn" : level <= 3 ? "Rất vui vẻ và năng động" : level <= 4 ? "Cực kỳ hạnh phúc" : "Đã trở thành vua!"
      };
    } else {
      const stages = ["🌱", "🌿", "🌳", "🌺", "🌸"];
      return {
        emoji: stages[Math.min(level - 1, stages.length - 1)],
        name: level <= 1 ? "Mầm non" : level <= 2 ? "Cây con" : level <= 3 ? "Cây trưởng thành" : level <= 4 ? "Cây có hoa" : "Cây nở rộ",
        description: level <= 1 ? "Vừa mới nảy mầm" : level <= 2 ? "Đang lớn từng ngày" : level <= 3 ? "Rất khỏe mạnh" : level <= 4 ? "Bắt đầu ra hoa" : "Nở hoa tuyệt đẹp!"
      };
    }
  };

  const reward = getRewardDisplay();
  const progressToNext = (totalFocusTime % 30) / 30 * 100;

  return (
    <Card className="reward-system border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
          🏆 Hệ thống thưởng
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-6xl animate-bounce">{reward.emoji}</div>
        
        <div>
          <h3 className="font-semibold text-primary">{reward.name}</h3>
          <p className="text-sm text-muted-foreground">{reward.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round((30 - (totalFocusTime % 30)))} phút nữa để level tiếp theo
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setRewardType("cat")}
            className={`p-2 rounded-lg border ${rewardType === "cat" ? "border-primary bg-primary/10" : "border-muted"}`}
          >
            🐱 Mèo
          </button>
          <button
            onClick={() => setRewardType("plant")}
            className={`p-2 rounded-lg border ${rewardType === "plant" ? "border-primary bg-primary/10" : "border-muted"}`}
          >
            🌱 Cây
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Tổng thời gian tập trung: {Math.round(totalFocusTime)} phút
        </div>
      </CardContent>
    </Card>
  );
};