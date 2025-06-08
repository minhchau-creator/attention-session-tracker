
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceConnection } from "@/components/DeviceConnection";
import { RealtimeBrainwaveChart } from "@/components/RealtimeBrainwaveChart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Chào mừng, {user?.name || "Người dùng"}</h1>
        <p className="text-muted-foreground">
          Theo dõi và cải thiện khả năng tập trung với neurofeedback
        </p>
      </div>

      {/* Real-time Brainwave Chart */}
      <div className="max-w-6xl mx-auto mb-8">
        <RealtimeBrainwaveChart />
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <DeviceConnection />

        <Card className="connection-card overflow-hidden">
          <div className="h-2 w-full bg-primary"></div>
          <CardHeader>
            <CardTitle>Phiên Tập Trung</CardTitle>
            <CardDescription>
              Bắt đầu phiên học tập với giám sát EEG
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-primary mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold">Tập trung</div>
                <div className="text-xs mt-1">Bắt đầu phiên</div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/lock-in")} 
              className="w-full"
            >
              Bắt đầu học tập
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-6 rounded-lg brain-wave-bg">
        <h2 className="text-2xl font-semibold mb-4">
          Hiểu về Neurofeedback
        </h2>
        <div className="space-y-4">
          <p>
            Neurofeedback là một loại biofeedback sử dụng hiển thị thời gian thực của hoạt động não bộ để dạy tự điều chỉnh chức năng não.
          </p>
          <p>
            Bằng cách giám sát sóng não trong các phiên học tập, bạn có thể:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Xác định khi nào bạn tập trung cao nhất</li>
            <li>Nhận biết các mẫu dẫn đến mất tập trung</li>
            <li>Rèn luyện não bộ duy trì trạng thái học tập tối ưu</li>
            <li>Cải thiện hiệu quả học tập theo thời gian</li>
          </ul>
          <p className="font-medium">
            Kết nối thiết bị EEG và bắt đầu phiên tập trung để giám sát hoạt động não bộ trong quá trình học.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
