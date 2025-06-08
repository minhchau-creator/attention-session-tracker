import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceConnection } from "@/components/DeviceConnection";
import { RealtimeBrainwaveChart } from "@/components/RealtimeBrainwaveChart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Brain, PlayCircle } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Chào mừng, {user?.name || "Người dùng"}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Theo dõi và cải thiện khả năng tập trung với <strong>Neurofeedback</strong>
        </p>
      </motion.div>

      {/* Real-time Chart */}
      <motion.div 
        className="max-w-4xl md:max-w-6xl mx-auto mb-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RealtimeBrainwaveChart />
      </motion.div>

      {/* Device + Focus */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl md:max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DeviceConnection />
        </motion.div>

        <motion.div
          className="connection-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-2 w-full bg-primary"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PlayCircle className="text-primary" />
                <CardTitle>Sẵn sàng tập trung ?</CardTitle>
              </div>
              <CardDescription>
                Bắt đầu học tập với giám sát EEG
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <motion.div 
                className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-primary mb-6 animate-pulse bg-muted"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">Focus</div>
                  <div className="text-xs mt-1">Bắt đầu</div>
                </div>
              </motion.div>
              <Button 
                onClick={() => navigate("/lock-in")} 
                className="w-full"
              >
                Bắt đầu học tập
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Neurofeedback Info */}
      <motion.div 
        className="max-w-4xl mx-auto mt-10 p-6 rounded-lg brain-wave-bg shadow-md bg-background"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-primary" />
          <h2 className="text-2xl font-semibold">Hiểu về Neurofeedback</h2>
        </div>
        <div className="space-y-4 text-muted-foreground text-sm md:text-base">
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
      </motion.div>
    </div>
  );
};

export default HomePage;
