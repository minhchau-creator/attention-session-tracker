
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Lightbulb } from "lucide-react";

interface FocusInsightsProps {
  longestFocusStreak: number;
  sessionDuration: number;
  averageFocusScore: number;
}

export const FocusInsights: React.FC<FocusInsightsProps> = ({
  longestFocusStreak,
  sessionDuration,
  averageFocusScore
}) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  const getInsights = (): string[] => {
    const insights: string[] = [];
    
    if (longestFocusStreak < 15) {
      insights.push("Bạn thường mất tập trung sau 15 phút, hãy thử chia buổi học thành các phiên 15p nghỉ 5p.");
    } else if (longestFocusStreak < 25) {
      insights.push("Bạn thường mất tập trung sau 20 phút, hãy thử chia buổi học thành các phiên 20p nghỉ 5p.");
    } else {
      insights.push("Khả năng tập trung của bạn rất tốt! Hãy duy trì nhịp độ này.");
    }

    if (averageFocusScore < 50) {
      insights.push("Hãy tìm một môi trường yên tĩnh hơn để cải thiện độ tập trung.");
      insights.push("Thử nghỉ ngơi đầy đủ trước khi học để tăng hiệu quả.");
    } else if (averageFocusScore < 75) {
      insights.push("Tắt các thiết bị gây phân tâm như điện thoại, mạng xã hội.");
      insights.push("Thử kỹ thuật Pomodoro để tối ưu hóa thời gian học.");
    } else {
      insights.push("Bạn đã có khả năng tập trung tốt, tiếp tục duy trì!");
    }

    return insights;
  };

  return (
    <div className="grid gap-6">
      {/* Thống kê nổi bật */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ⏱️ Thời gian tập trung liên tục dài nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatTime(longestFocusStreak)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {longestFocusStreak < 25 
                ? `Cố gắng đạt ${25} phút vào lần sau!`
                : "Xuất sắc! Bạn đã đạt mục tiêu!"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              📊 Hiệu suất tổng thể
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {averageFocusScore}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {averageFocusScore >= 75 ? "Tuyệt vời!" : 
               averageFocusScore >= 50 ? "Khá tốt" : "Cần cải thiện"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gợi ý cải thiện */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            📝 Gợi ý cải thiện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getInsights().map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
