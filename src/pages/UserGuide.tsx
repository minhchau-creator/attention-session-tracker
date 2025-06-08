import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Timer, Cat, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserGuide = () => {
  const navigate = useNavigate();

  const guideSteps = [
    {
      icon: Brain,
      title: "1. Kết nối thiết bị EEG",
      description: "Kết nối thiết bị EEG của bạn để bắt đầu giám sát sóng não trong quá trình học tập."
    },
    {
      icon: Timer,
      title: "2. Thiết lập phiên học tập",
      description: "Chọn một trong 3 chế độ: Đếm ngược, Pomodoro, hoặc Bấm giờ. Thêm danh sách công việc cần hoàn thành."
    },
    {
      icon: Cat,
      title: "3. Kiếm tiền nuôi mèo",
      description: "Tập trung để kiếm tiền. Sử dụng tiền để mua mèo mới và chăm sóc chúng trong bộ sưu tập."
    },
    {
      icon: BarChart3,
      title: "4. Xem thống kê tiến bộ",
      description: "Theo dõi lịch sử học tập và phân tích xu hướng cải thiện khả năng tập trung của bạn."
    }
  ];

  const modes = [
    {
      title: "Chế độ Đếm ngược",
      description: "Đặt thời gian từ 5 phút đến 3 giờ. Thời gian càng dài, phần thưởng càng nhiều.",
      features: ["Thanh kéo thời gian", "Todo list", "Phần thưởng theo thời gian"]
    },
    {
      title: "Chế độ Pomodoro",
      description: "Kỹ thuật Pomodoro cổ điển với thời gian tập trung và nghỉ tùy chỉnh.",
      features: ["Thời gian tập trung (mặc định 25')", "Thời gian nghỉ", "Số lượng phiên", "Todo list"]
    },
    {
      title: "Chế độ Bấm giờ",
      description: "Đồng hồ bấm giờ tự do, kiếm tiền theo từng khoảng thời gian.",
      features: ["Bấm giờ tự do", "Phần thưởng mỗi 5 phút", "Không giới hạn thời gian"]
    }
  ];

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
          <h1 className="text-3xl font-bold mb-2">Hướng dẫn sử dụng FocusTracker</h1>
          <p className="text-muted-foreground">
            Tìm hiểu cách sử dụng ứng dụng để cải thiện khả năng tập trung
          </p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🚀 Bắt đầu nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {guideSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📚 Các chế độ học tập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modes.map((mode, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{mode.title}</h3>
                  <p className="text-muted-foreground mb-4">{mode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((feature, fIndex) => (
                      <span key={fIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reward System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🐱 Hệ thống thưởng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐱💰</div>
                <h3 className="text-lg font-semibold mb-2">Tập trung để kiếm tiền nuôi mèo!</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">💰 Cách kiếm tiền</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tập trung liên tục để kiếm tiền</li>
                    <li>• Bonus khi điểm tập trung cao</li>
                    <li>• Hoàn thành todo list để có thêm tiền</li>
                    <li>• Thời gian học càng lâu, tiền càng nhiều</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🛒 Sử dụng tiền</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Mua mèo mới trong cửa hàng</li>
                    <li>• Cho mèo ăn để tăng độ no</li>
                    <li>• Cho mèo uống nước để tăng độ khát</li>
                    <li>• Mèo level cao giá càng đắt</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Tricks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">💡 Mẹo sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">🎯 Tối ưu hóa tập trung</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Chọn môi trường phù hợp với sở thích</li>
                  <li>• Đặt mục tiêu rõ ràng trong todo list</li>
                  <li>• Bắt đầu với thời gian ngắn rồi tăng dần</li>
                  <li>• Nghỉ ngơi đúng cách giữa các phiên</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">📊 Theo dõi tiến bộ</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Xem lịch sử học tập thường xuyên</li>
                  <li>• Phân tích xu hướng cải thiện</li>
                  <li>• Đặt mục tiêu hàng ngày/tuần</li>
                  <li>• So sánh hiệu suất giữa các phiên</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => navigate("/lock-in")} size="lg">
            🚀 Bắt đầu học tập ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;