import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Cat {
  id: number;
  name: string;
  emoji: string;
  level: number;
  price: number;
  owned: boolean;
  hunger: number;
  thirst: number;
  nextUpdate?: number;
}

const CATS_DATA: Cat[] = [
  { id: 1, name: "Mèo con", emoji: "🐱", level: 1, price: 100, owned: false, hunger: 100, thirst: 100},
  { id: 2, name: "Mèo trưởng thành", emoji: "🐾", level: 2, price: 250, owned: false, hunger: 100, thirst: 100 },
  { id: 3, name: "Mèo vui vẻ", emoji: "😸", level: 3, price: 500, owned: false, hunger: 100, thirst: 100 },
  { id: 4, name: "Mèo hạnh phúc", emoji: "😻", level: 4, price: 750, owned: false, hunger: 100, thirst: 100 },
  { id: 5, name: "Vua sư tử", emoji: "🦁", level: 5, price: 1000, owned: false, hunger: 100, thirst: 100 },
  { id: 6, name: "Mèo hoàng gia", emoji: "👑", level: 6, price: 1500, owned: false, hunger: 100, thirst: 100 },
  { id: 7, name: "Mèo phép thuật", emoji: "🔮", level: 7, price: 2000, owned: false, hunger: 100, thirst: 100 },
  { id: 8, name: "Mèo rồng", emoji: "🐉", level: 8, price: 3000, owned: false, hunger: 100, thirst: 100 },
];

export const CatCollection: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>(CATS_DATA);
  const [money, setMoney] = useState(5000);
  const [activeTab, setActiveTab] = useState<"collection" | "shop">("collection");
  const [tick, setTick] = useState(0); // NEW: Force re-render every second
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved data
  useEffect(() => {
    const savedCats = localStorage.getItem("userCats");
    const savedMoney = localStorage.getItem("userMoney");
    const lastVisit = localStorage.getItem("lastVisit");

    if (savedCats) {
      let parsedCats = JSON.parse(savedCats) as Cat[];
      parsedCats = parsedCats.map(cat => ({
        ...cat,
        nextUpdate: cat.nextUpdate ?? Date.now() + 5 * 60 * 1000,
      }));

      // Nếu đã qua ít nhất 2 ngày
      if (lastVisit) {
        const now = new Date();
        const lastDate = new Date(lastVisit);
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 2) {
          parsedCats = parsedCats.map(cat =>
            cat.owned
              ? {
                  ...cat,
                  hunger: Math.max(0, cat.hunger - 50),
                  thirst: Math.max(0, cat.thirst - 50),
                }
              : cat
          );
        }
      }

      setCats(parsedCats);
    }

    if (savedMoney) {
      setMoney(parseInt(savedMoney));
    }

    localStorage.setItem("lastVisit", new Date().toISOString());
  }, []);

  // Update cats every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1); // trigger render
      setCats(prevCats =>
        prevCats.map(cat => {
          if (!cat.owned) return cat;
          const now = Date.now();
          if (cat.nextUpdate && now >= cat.nextUpdate) {
            return {
              ...cat,
              hunger: Math.max(0, cat.hunger - 5),
              thirst: Math.max(0, cat.thirst - 5),
              nextUpdate: now + 5 * 60 * 1000,
            };
          }
          return cat;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("userCats", JSON.stringify(cats));
    localStorage.setItem("userMoney", money.toString());
  }, [cats, money]);

  const formatCountdown = (timestamp?: number): string => {
    if (!timestamp) return "00:00";
    const diff = timestamp - Date.now();
    if (diff <= 0) return "00:00";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const buyCat = (catId: number) => {
    const cat = cats.find(c => c.id === catId);
    if (!cat || cat.owned || money < cat.price) {
      toast({
        title: "Không thể mua",
        description: cat?.owned ? "Bạn đã sở hữu mèo này" : "Không đủ tiền",
        variant: "destructive",
      });
      return;
    }

    setCats(prev =>
      prev.map(c =>
        c.id === catId
          ? { ...c, owned: true, nextUpdate: Date.now() + 5 * 60 * 1000 }
          : c
      )
    );
    setMoney(prev => prev - cat.price);

    toast({
      title: "Mua thành công!",
      description: `Bạn đã mua ${cat.name}`,
    });
  };

  const feedCat = (catId: number) => {
    const cat = cats.find(c => c.id === catId);
    if (!cat || !cat.owned || money < 10) {
      toast({
        title: "Không thể cho ăn",
        description: "Không đủ tiền hoặc chưa sở hữu mèo",
        variant: "destructive",
      });
      return;
    }

    setCats(prev =>
      prev.map(c =>
        c.id === catId ? { ...c, hunger: Math.min(100, c.hunger + 20) } : c
      )
    );
    setMoney(prev => prev - 10);

    toast({
      title: "Cho ăn thành công!",
      description: "-10 💰",
    });
  };

  const giveDrink = (catId: number) => {
    const cat = cats.find(c => c.id === catId);
    if (!cat || !cat.owned || money < 5) {
      toast({
        title: "Không thể cho uống",
        description: "Không đủ tiền hoặc chưa sở hữu mèo",
        variant: "destructive",
      });
      return;
    }

    setCats(prev =>
      prev.map(c =>
        c.id === catId ? { ...c, thirst: Math.min(100, c.thirst + 15) } : c
      )
    );
    setMoney(prev => prev - 5);

    toast({
      title: "Cho uống thành công!",
      description: "-5 💰",
    });
  };

  const ownedCats = cats.filter(cat => cat.owned);
  const shopCats = cats.filter(cat => !cat.owned);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bộ sưu tập mèo</h1>
          <p className="text-muted-foreground">Quản lý và chăm sóc những chú mèo của bạn</p>
        </div>
        <div className="ml-auto">
          <Card className="bg-primary/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{money} 💰</div>
              <div className="text-sm text-muted-foreground">Số dư hiện tại</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "collection" ? "default" : "outline"}
          onClick={() => setActiveTab("collection")}
        >
          🏠 Bộ sưu tập ({ownedCats.length})
        </Button>
        <Button
          variant={activeTab === "shop" ? "default" : "outline"}
          onClick={() => setActiveTab("shop")}
        >
          🛒 Cửa hàng ({shopCats.length})
        </Button>
      </div>

      {/* Collection Tab */}
      {activeTab === "collection" && (
        <div>
          {ownedCats.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">😿</div>
                <h3 className="text-xl font-semibold mb-2">Chưa có mèo nào</h3>
                <p className="text-muted-foreground mb-4">
                  Hãy mua mèo đầu tiên từ cửa hàng!
                </p>
                <Button onClick={() => setActiveTab("shop")}>Đến cửa hàng</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedCats.map(cat => (
                <Card key={cat.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-2">{cat.emoji}</div>
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Level {cat.level}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>🍖 Độ đói</span>
                          <span>{cat.hunger}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${cat.hunger}%` }} />
                        </div>
                        
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>💧 Độ khát</span>
                          <span>{cat.thirst}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${cat.thirst}%` }} />
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Thời gian no: {formatCountdown(cat.nextUpdate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => feedCat(cat.id)} disabled={money < 10} className="flex-1">
                        🍖 Cho ăn (10💰)
                      </Button>
                      <Button size="sm" onClick={() => giveDrink(cat.id)} disabled={money < 5} className="flex-1">
                        💧 Cho uống (5💰)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shop Tab */}
      {activeTab === "shop" && (
        <div>
          {shopCats.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold mb-2">Đã sưu tầm hết!</h3>
                <p className="text-muted-foreground">Bạn đã sở hữu tất cả các loại mèo có sẵn.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopCats.map(cat => (
                <Card key={cat.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-2 opacity-80">{cat.emoji}</div>
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Level {cat.level}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{cat.price} 💰</div>
                      <p className="text-sm text-muted-foreground">Giá mua</p>
                    </div>
                    <Button onClick={() => buyCat(cat.id)} disabled={money < cat.price} className="w-full">
                      {money >= cat.price ? "Mua ngay" : "Không đủ tiền"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
