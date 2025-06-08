import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface SurveyData {
  maxFocusTime: number;
  wantToChange: string;
  distractionFactors: string[];
  customDistraction: string;
}

interface UserSurveyProps {
  onComplete: (data: SurveyData) => void;
}

const commonDistractions = [
  "Mạng xã hội", "Điện thoại", "Tiếng ồn", "Buồn ngủ", 
  "Căng thẳng", "Đói", "Suy nghĩ lung tung", "Email/tin nhắn"
];

export const UserSurvey: React.FC<UserSurveyProps> = ({ onComplete }) => {
  const [data, setData] = useState<SurveyData>({
    maxFocusTime: 30,
    wantToChange: "",
    distractionFactors: [],
    customDistraction: ""
  });

  const handleDistractionToggle = (distraction: string) => {
    setData(prev => ({
      ...prev,
      distractionFactors: prev.distractionFactors.includes(distraction)
        ? prev.distractionFactors.filter(d => d !== distraction)
        : [...prev.distractionFactors, distraction]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add custom distraction if provided
    const finalData = {
      ...data,
      distractionFactors: data.customDistraction 
        ? [...data.distractionFactors, data.customDistraction]
        : data.distractionFactors
    };
    
    // Save to localStorage
    localStorage.setItem("userSurvey", JSON.stringify(finalData));
    onComplete(finalData);
  };

  const isValid = data.wantToChange.length > 0 && data.distractionFactors.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-violet-100 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            🧠 Khảo sát khả năng học tập
          </CardTitle>
          <p className="text-muted-foreground">
            Giúp chúng tôi hiểu rõ hơn về khả năng tập trung của bạn
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Max Focus Time */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Thời gian tập trung tối đa của bạn hiện tại?
              </Label>
              <div className="px-3">
                <Slider
                  value={[data.maxFocusTime]}
                  onValueChange={(value) => setData(prev => ({ ...prev, maxFocusTime: value[0] }))}
                  max={180}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>5 phút</span>
                  <span className="font-medium text-primary">{data.maxFocusTime} phút</span>
                  <span>3 giờ</span>
                </div>
              </div>
            </div>

            {/* What to change */}
            <div className="space-y-2">
              <Label htmlFor="wantToChange" className="text-base font-medium">
                Bạn muốn thay đổi điều gì trong việc học tập?
              </Label>
              <Textarea
                id="wantToChange"
                placeholder="VD: Muốn học lâu hơn, tập trung sâu hơn, ít mất tập trung..."
                value={data.wantToChange}
                onChange={(e) => setData(prev => ({ ...prev, wantToChange: e.target.value }))}
                rows={3}
                required
              />
            </div>

            {/* Distraction factors */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Điều gì thường khiến bạn khó tập trung? (chọn nhiều)
              </Label>
              <div className="flex flex-wrap gap-2">
                {commonDistractions.map((distraction) => (
                  <Badge
                    key={distraction}
                    variant={data.distractionFactors.includes(distraction) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleDistractionToggle(distraction)}
                  >
                    {distraction}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Nguyên nhân khác..."
                value={data.customDistraction}
                onChange={(e) => setData(prev => ({ ...prev, customDistraction: e.target.value }))}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={!isValid}
            >
              Tiếp tục phân tích →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};