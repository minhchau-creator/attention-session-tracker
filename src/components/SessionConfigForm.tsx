import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export interface SessionConfig {
  name: string;
  duration: number;
  environment: string;
  description: string;
  goals: string[];
}

interface SessionConfigFormProps {
  onStartSession: (config: SessionConfig) => void;
  onCancel: () => void;
}

const environments = [
  {
    id: "default",
    name: "Mặc định - Không phân tâm",
    description: "Màn hình tối giản, không có yếu tố gây xao nhãng",
    icon: "🎯"
  },
  {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "Chu kỳ 25 phút học + 5 phút nghỉ",
    icon: "🍅"
  },
  {
    id: "nature",
    name: "Thiên nhiên thư giãn",
    description: "Hình ảnh rừng xanh với âm thanh tự nhiên",
    icon: "🌲"
  },
  {
    id: "ocean",
    name: "Bờ biển yên tĩnh",
    description: "Tiếng sóng vỗ bờ và hình ảnh đại dương",
    icon: "🌊"
  },
  {
    id: "rain",
    name: "Mưa rơi nhẹ nhàng",
    description: "Âm thanh mưa rơi thư giãn",
    icon: "🌧️"
  },
  {
    id: "cafe",
    name: "Quán cà phê ấm cúng",
    description: "Không gian cà phê với nhạc nền nhẹ nhàng",
    icon: "☕"
  },
  {
    id: "library",
    name: "Thư viện yên tĩnh",
    description: "Không gian học tập tập trung",
    icon: "📚"
  }
];

const commonGoals = [
  "Đọc sách", "Làm bài tập", "Ôn thi", "Học ngôn ngữ", 
  "Viết báo cáo", "Làm dự án", "Nghiên cứu", "Học online"
];

export const SessionConfigForm: React.FC<SessionConfigFormProps> = ({ onStartSession, onCancel }) => {
  const [config, setConfig] = useState<SessionConfig>({
    name: "",
    duration: 30,
    environment: "default",
    description: "",
    goals: []
  });

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      ...config,
      goals: selectedGoals
    });
  };

  const selectedEnvironment = environments.find(env => env.id === config.environment);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Cấu hình phiên học tập</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Name */}
          <div className="space-y-2">
            <Label htmlFor="sessionName">Tên phiên học</Label>
            <Input
              id="sessionName"
              placeholder="VD: Ôn thi Toán học, Đọc sách lịch sử..."
              value={config.name}
              onChange={(e) => setConfig({...config, name: e.target.value})}
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Thời gian học (phút)</Label>
            <Select 
              value={config.duration.toString()} 
              onValueChange={(value) => setConfig({...config, duration: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 phút</SelectItem>
                <SelectItem value="25">25 phút (Pomodoro)</SelectItem>
                <SelectItem value="30">30 phút</SelectItem>
                <SelectItem value="45">45 phút</SelectItem>
                <SelectItem value="60">1 giờ</SelectItem>
                <SelectItem value="90">1.5 giờ</SelectItem>
                <SelectItem value="120">2 giờ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label>Môi trường học tập</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    config.environment === env.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setConfig({...config, environment: env.id})}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{env.icon}</span>
                    <span className="font-medium text-sm">{env.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{env.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label>Mục tiêu học tập (chọn nhiều)</Label>
            <div className="flex flex-wrap gap-2">
              {commonGoals.map((goal) => (
                <Badge
                  key={goal}
                  variant={selectedGoals.includes(goal) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleGoalToggle(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về nội dung học tập hoặc mục tiêu cụ thể..."
              value={config.description}
              onChange={(e) => setConfig({...config, description: e.target.value})}
              rows={3}
            />
          </div>

          {/* Summary */}
          {config.name && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Tóm tắt phiên học:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Tên:</strong> {config.name}</p>
                <p><strong>Thời gian:</strong> {config.duration} phút</p>
                <p><strong>Môi trường:</strong> {selectedEnvironment?.icon} {selectedEnvironment?.name}</p>
                {selectedGoals.length > 0 && (
                  <p><strong>Mục tiêu:</strong> {selectedGoals.join(", ")}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={!config.name}>
              Bắt đầu phiên học
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};