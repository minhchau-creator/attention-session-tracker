
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BrainwaveDataPoint {
  time: string;
  attention: number;
  alpha: number;
  beta: number;
  theta: number;
}

interface BrainwaveChartProps {
  data: BrainwaveDataPoint[];
}

export const BrainwaveChart: React.FC<BrainwaveChartProps> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Brain Wave Activity</CardTitle>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attention"
                stroke="#6E59A5"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="alpha"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="beta"
                stroke="#9b87f5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="theta"
                stroke="#D6BCFA"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Generate mock data for demo purposes
export const generateMockBrainwaveData = (sessionLength: number): BrainwaveDataPoint[] => {
  const data: BrainwaveDataPoint[] = [];
  const startTime = new Date();
  
  for (let i = 0; i < sessionLength; i++) {
    const time = new Date(startTime.getTime() + i * 60000);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Generate realistic-looking brain wave patterns
    const baseAttention = 40 + Math.sin(i / 5) * 20 + Math.random() * 10;
    const attention = Math.min(100, Math.max(0, baseAttention));
    
    data.push({
      time: timeStr,
      attention: Math.round(attention),
      alpha: Math.round(30 + Math.sin(i / 3) * 15 + Math.random() * 10),
      beta: Math.round(20 + Math.cos(i / 4) * 10 + Math.random() * 15),
      theta: Math.round(25 + Math.sin(i / 6 + 2) * 10 + Math.random() * 5),
    });
  }
  
  return data;
};
