
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface FocusDataPoint {
  time: string;
  focus: number;
  isLowPoint?: boolean;
}

interface FocusTimeChartProps {
  data: FocusDataPoint[];
}

export const FocusTimeChart: React.FC<FocusTimeChartProps> = ({ data }) => {
  // Tìm điểm tập trung thấp nhất
  const minFocus = Math.min(...data.map(d => d.focus));
  const lowPoints = data.filter(d => d.focus === minFocus);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isLowPoint = payload[0].payload.focus === minFocus;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Thời gian: ${label}`}</p>
          <p className={`${isLowPoint ? 'text-red-600 font-bold' : 'text-blue-600'}`}>
            {`Tập trung: ${payload[0].value}%`}
          </p>
          {isLowPoint && (
            <p className="text-red-500 text-sm mt-1">⚠️ Điểm rơi tập trung</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📉 Biểu đồ độ tập trung theo thời gian
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="focus"
                stroke="#6E59A5"
                strokeWidth={3}
                dot={(props) => {
                  const isLowPoint = props.payload.focus === minFocus;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={isLowPoint ? 6 : 3}
                      fill={isLowPoint ? "#ef4444" : "#6E59A5"}
                      stroke={isLowPoint ? "#dc2626" : "#6E59A5"}
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 8, fill: "#6E59A5" }}
              />
              {/* Đường cảnh báo cho mức tập trung thấp */}
              <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>🔴 Điểm đỏ: Điểm rơi tập trung ({minFocus}%)</p>
          <p>📏 Đường đỏ đứt: Ngưỡng cảnh báo (30%)</p>
        </div>
      </CardContent>
    </Card>
  );
};
