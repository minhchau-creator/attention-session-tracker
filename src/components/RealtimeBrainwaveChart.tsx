import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDevice } from "@/context/DeviceContext";

interface BrainwaveDataPoint {
  time: string;
  delta: number;
  alpha: number;
  beta: number;
  theta: number;
}

export const RealtimeBrainwaveChart: React.FC = () => {
  const { isDeviceConnected } = useDevice();
  const [data, setData] = useState<BrainwaveDataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Start real-time data generation when device is connected
  useEffect(() => {
    if (isDeviceConnected && !isRunning) {
      setIsRunning(true);
      setData([]); // Clear previous data
    } else if (!isDeviceConnected) {
      setIsRunning(false);
      setData([]);
    }
  }, [isDeviceConnected, isRunning]);

  // Generate real-time brainwave data
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && isDeviceConnected) {
      interval = window.setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
        
        // Generate realistic brainwave frequencies (Hz)
        const newDataPoint: BrainwaveDataPoint = {
          time: timeStr,
          delta: Math.round((0.5 + Math.sin(Date.now() / 5000) * 0.3 + Math.random() * 0.4) * 10) / 10, // 0.5-4 Hz
          theta: Math.round((4 + Math.sin(Date.now() / 3000) * 1.5 + Math.random() * 1) * 10) / 10, // 4-8 Hz
          alpha: Math.round((8 + Math.sin(Date.now() / 2000) * 2 + Math.random() * 2) * 10) / 10, // 8-12 Hz
          beta: Math.round((15 + Math.sin(Date.now() / 1500) * 5 + Math.random() * 3) * 10) / 10, // 12-30 Hz
        };
        
        setData(prevData => {
          const newData = [...prevData, newDataPoint];
          // Keep only last 20 data points for smooth visualization
          return newData.slice(-20);
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isDeviceConnected]);

  if (!isDeviceConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hoạt động sóng não thời gian thực</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl mb-2">📡</div>
              <p>Kết nối thiết bị EEG để xem dữ liệu thời gian thực</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Hoạt động sóng não thời gian thực
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} Hz`}
                domain={[0, 25]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
                formatter={(value: any) => [`${value} Hz`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="delta"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="Delta (0.5-4 Hz)"
              />
              <Line
                type="monotone"
                dataKey="theta"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                name="Theta (4-8 Hz)"
              />
              <Line
                type="monotone"
                dataKey="alpha"
                stroke="#eab308"
                strokeWidth={2}
                dot={false}
                name="Alpha (8-12 Hz)"
              />
              <Line
                type="monotone"
                dataKey="beta"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Beta (12-30 Hz)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Delta: Giấc ngủ sâu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Theta: Thư giãn sâu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Alpha: Thư giãn tỉnh thức</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Beta: Tập trung, suy nghĩ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
