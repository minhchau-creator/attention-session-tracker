import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus } from "lucide-react";

export interface SessionConfig {
  name: string;
  mode: "countdown" | "pomodoro" | "stopwatch";
  duration: number;
  environment: string;
  description: string;
  goals: string[];
  todoList: string[];
  // Pomodoro specific
  breakDuration?: number;
  sessions?: number;
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
    mode: "countdown",
    duration: 30,
    environment: "default",
    description: "",
    goals: [],
    todoList: [],
    breakDuration: 5,
    sessions: 4
  });

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setConfig(prev => ({
        ...prev,
        todoList: [...prev.todoList, newTodo.trim()]
      }));
      setNewTodo("");
    }
  };

  const handleRemoveTodo = (index: number) => {
    setConfig(prev => ({
      ...prev,
      todoList: prev.todoList.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      ...config,
      goals: selectedGoals
    });
  };

  const getRewardEstimate = () => {
    const baseReward = Math.floor(config.duration / 5) * 10;
    return baseReward;
  };

  const selectedEnvironment = environments.find(env => env.id === config.environment);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">🎯 Cấu hình phiên học tập</CardTitle>
        <p className="text-center text-muted-foreground">
          Chọn chế độ học tập phù hợp với bạn
        </p>
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

          {/* Study Modes */}
          <Tabs 
            value={config.mode} 
            onValueChange={(value) => setConfig({...config, mode: value as "countdown" | "pomodoro" | "stopwatch"})}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="countdown">⏱️ Đếm ngược</TabsTrigger>
              <TabsTrigger value="pomodoro">🍅 Pomodoro</TabsTrigger>
              <TabsTrigger value="stopwatch">⏰ Bấm giờ</TabsTrigger>
            </TabsList>

            <TabsContent value="countdown" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">⏱️ Chế độ đếm ngược</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Đặt thời gian học cố định. Phần thưởng tăng theo thời gian.
                </p>
                
                <div className="space-y-3">
                  <Label>Thời gian học: {config.duration} phút</Label>
                  <Slider
                    value={[config.duration]}
                    onValueChange={(value) => setConfig({...config, duration: value[0]})}
                    max={180}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 phút</span>
                    <span className="font-medium text-primary">
                      {getRewardEstimate()} hạt thức ăn dự kiến
                    </span>
                    <span>3 giờ</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pomodoro" className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">🍅 Chế độ Pomodoro</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chu kỳ học-nghỉ để duy trì sự tập trung.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Thời gian học (phút)</Label>
                    <Input
                      type="number"
                      value={config.duration}
                      onChange={(e) => setConfig({...config, duration: parseInt(e.target.value) || 25})}
                      min={15}
                      max={60}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Thời gian nghỉ (phút)</Label>
                    <Input
                      type="number"
                      value={config.breakDuration}
                      onChange={(e) => setConfig({...config, breakDuration: parseInt(e.target.value) || 5})}
                      min={3}
                      max={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số phiên</Label>
                    <Input
                      type="number"
                      value={config.sessions}
                      onChange={(e) => setConfig({...config, sessions: parseInt(e.target.value) || 4})}
                      min={1}
                      max={8}
                    />
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Tổng thời gian: {(config.duration * (config.sessions || 4) + (config.breakDuration || 5) * ((config.sessions || 4) - 1))} phút
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stopwatch" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">⏰ Chế độ bấm giờ</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Học không giới hạn thời gian. Thưởng liên tục theo thời gian.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <div className="font-medium">+15 hạt thức ăn mỗi 5 phút</div>
                    <div className="text-sm text-muted-foreground">
                      Bonus x2 nếu tập trung liên tục
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Todo List */}
          <div className="space-y-3">
            <Label>📝 Danh sách công việc</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Thêm công việc cần hoàn thành..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTodo())}
              />
              <Button type="button" onClick={handleAddTodo} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {config.todoList.length > 0 && (
              <div className="space-y-2">
                {config.todoList.map((todo, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <span className="flex-1">{todo}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTodo(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label>🎨 Môi trường học tập</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            <Label>🎯 Mục tiêu học tập (chọn nhiều)</Label>
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

          {/* Summary */}
          {config.name && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">📋 Tóm tắt phiên học:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Tên:</strong> {config.name}</p>
                <p><strong>Chế độ:</strong> {
                  config.mode === "countdown" ? "⏱️ Đếm ngược" :
                  config.mode === "pomodoro" ? "🍅 Pomodoro" : "⏰ Bấm giờ"
                }</p>
                <p><strong>Môi trường:</strong> {selectedEnvironment?.icon} {selectedEnvironment?.name}</p>
                {config.todoList.length > 0 && (
                  <p><strong>Công việc:</strong> {config.todoList.length} mục</p>
                )}
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
              🐱 Bắt đầu nuôi mèo!
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};