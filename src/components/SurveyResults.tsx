import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SurveyData {
  maxFocusTime: number;
  wantToChange: string;
  distractionFactors: string[];
}

interface SurveyResultsProps {
  surveyData: SurveyData;
  onContinue: () => void;
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ surveyData, onContinue }) => {
  // Calculate potential improvements
  const currentEfficiency = Math.min(surveyData.maxFocusTime / 60 * 100, 100);
  const potentialImprovement = Math.min(currentEfficiency + 40, 95);
  const dailyTasksCurrently = Math.floor(surveyData.maxFocusTime / 15);
  const dailyTasksPotential = Math.floor((surveyData.maxFocusTime * 1.6) / 15);

  const topDistraction = surveyData.distractionFactors[0] || "Yếu tố ngoại cảnh";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Analysis Results */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              📊 Phân tích khả năng học tập của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{surveyData.maxFocusTime}'</div>
                <div className="text-sm text-muted-foreground">Thời gian tập trung hiện tại</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{dailyTasksCurrently}</div>
                <div className="text-sm text-muted-foreground">Công việc/ngày hiện tại</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{topDistraction}</div>
                <div className="text-sm text-muted-foreground">Nguyên nhân chính mất tập trung</div>
              </div>
            </div>

            {/* Potential Improvement */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">🚀 Tiềm năng cải thiện của bạn</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Hiệu suất học tập hiện tại</span>
                  <span className="font-medium">{Math.round(currentEfficiency)}%</span>
                </div>
                <Progress value={currentEfficiency} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Tiềm năng với EEG Focus Trainer</span>
                  <span className="font-medium text-green-600">{Math.round(potentialImprovement)}%</span>
                </div>
                <Progress value={potentialImprovement} className="h-2" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-800">
                  <p className="font-medium">Kết quả dự kiến:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Tăng thời gian tập trung lên <strong>{Math.round(surveyData.maxFocusTime * 1.6)} phút</strong></li>
                    <li>Hoàn thành được <strong>{dailyTasksPotential} công việc/ngày</strong> thay vì {dailyTasksCurrently}</li>
                    <li>Giảm <strong>60%</strong> tác động của {topDistraction.toLowerCase()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward System Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              🐱 Hệ thống thưởng: Chăm sóc mèo béo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🐱</div>
              <h3 className="text-lg font-semibold mb-2">Hãy tập trung để chăm sóc mèo béo!</h3>
              <p className="text-muted-foreground">
                Mỗi phút tập trung = hạt thức ăn cho mèo. Tập trung càng lâu, mèo càng béo và đáng yêu!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <h4 className="font-medium">🏆 Hệ thống thưởng</h4>
                <ul className="text-sm space-y-2">
                  <li>• 5 phút tập trung = 10 hạt thức ăn</li>
                  <li>• Tập trung liên tục = bonus x2</li>
                  <li>• Hoàn thành mục tiêu = bonus skin mèo</li>
                  <li>• Streak hàng ngày = unlock skin đặc biệt</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">🎨 Sưu tập skin mèo</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-2xl">🐱</span>
                  <span className="text-2xl opacity-50">😸</span>
                  <span className="text-2xl opacity-30">😻</span>
                  <span className="text-2xl opacity-20">🦁</span>
                  <span className="text-2xl opacity-10">🐅</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mở khóa bằng cách tập trung đủ lâu mỗi ngày!
                </p>
              </div>
            </div>

            <Button onClick={onContinue} className="w-full" size="lg">
              Bắt đầu nuôi mèo! 🐱
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};