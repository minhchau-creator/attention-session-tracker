import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  duration: number;
  averageFocusScore: number;
  timestamp: string;
  focusLevel: string;
  sessionName: string;
  goals: string[];
  environment: string;
  targetDuration: number;
}

export const SessionHistoryTable: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const { toast } = useToast();

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("focusSessions");
    if (savedSessions) {
      const sessionData = JSON.parse(savedSessions);
      setSessions(sessionData);
      setFilteredSessions(sessionData);
    }
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...sessions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.environment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Time period filter
    if (filterPeriod !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterPeriod) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(session => new Date(session.timestamp) >= filterDate);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case "duration":
          return b.duration - a.duration;
        case "focus":
          return b.averageFocusScore - a.averageFocusScore;
        case "name":
          return a.sessionName.localeCompare(b.sessionName);
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, filterPeriod, sortBy]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFocusLevelColor = (level: string): string => {
    switch (level) {
      case "high": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const deleteSession = (index: number) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    setSessions(updatedSessions);
    localStorage.setItem("focusSessions", JSON.stringify(updatedSessions));
    toast({
      title: "Đã xóa session",
      description: "Session học tập đã được xóa khỏi lịch sử"
    });
  };

  const clearAllSessions = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử học tập?")) {
      setSessions([]);
      localStorage.removeItem("focusSessions");
      toast({
        title: "Đã xóa toàn bộ lịch sử",
        description: "Tất cả session học tập đã được xóa"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Lịch sử học tập
          </span>
          <Button variant="destructive" size="sm" onClick={clearAllSessions}>
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa tất cả
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Tìm kiếm theo tên session hoặc môi trường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:flex-1"
          />
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Lọc theo thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Ngày gần nhất</SelectItem>
              <SelectItem value="duration">Thời lượng</SelectItem>
              <SelectItem value="focus">Điểm tập trung</SelectItem>
              <SelectItem value="name">Tên session</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredSessions.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Session</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Điểm tập trung</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Môi trường</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{session.sessionName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(session.timestamp)}
                    </TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{session.averageFocusScore}%</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFocusLevelColor(session.focusLevel)}`}>
                        {session.focusLevel === "high" ? "Cao" : session.focusLevel === "medium" ? "Trung bình" : "Thấp"}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">{session.environment}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSession(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {sessions.length === 0 ? (
              <div>
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có session học tập nào</p>
                <p className="text-sm">Bắt đầu một session để xem lịch sử tại đây</p>
              </div>
            ) : (
              <p>Không tìm thấy session nào phù hợp với bộ lọc</p>
            )}
          </div>
        )}

        {/* Summary */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{sessions.length}</div>
              <div className="text-sm text-muted-foreground">Tổng session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatDuration(sessions.reduce((total, session) => total + session.duration, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Tổng thời gian</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(sessions.reduce((total, session) => total + session.averageFocusScore, 0) / sessions.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Điểm TB</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatDuration(Math.max(...sessions.map(session => session.duration)))}
              </div>
              <div className="text-sm text-muted-foreground">Session dài nhất</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};