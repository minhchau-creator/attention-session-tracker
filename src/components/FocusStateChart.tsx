
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface FocusStateData {
  name: string;
  value: number;
  color: string;
}

interface FocusStateChartProps {
  highFocusTime: number;
  mediumFocusTime: number;
  lowFocusTime: number;
}

export const FocusStateChart: React.FC<FocusStateChartProps> = ({
  highFocusTime,
  mediumFocusTime,
  lowFocusTime
}) => {
  const totalTime = highFocusTime + mediumFocusTime + lowFocusTime;

  const data: FocusStateData[] = [
    {
      name: "Tập trung cao",
      value: Math.round((highFocusTime / totalTime) * 100),
      color: "#22c55e"
    },
    {
      name: "Tập trung trung bình",
      value: Math.round((mediumFocusTime / totalTime) * 100),
      color: "#f59e0b"
    },
    {
      name: "Mất tập trung",
      value: Math.round((lowFocusTime / totalTime) * 100),
      color: "#ef4444"
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Tỉ lệ thời gian theo trạng thái
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
