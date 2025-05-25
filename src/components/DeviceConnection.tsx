
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDevice } from "@/context/DeviceContext";

enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

export const DeviceConnection: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const { toast } = useToast();
  const { setIsDeviceConnected, setDeviceName } = useDevice();

  const handleConnect = () => {
    if (connectionState === ConnectionState.DISCONNECTED) {
      setConnectionState(ConnectionState.CONNECTING);
      
      // Simulate connection process
      toast({
        title: "Connecting",
        description: "Searching for EEG devices...",
      });
      
      setTimeout(() => {
        setConnectionState(ConnectionState.CONNECTED);
        setIsDeviceConnected(true);
        setDeviceName("NeuroSky MindWave");
        toast({
          title: "Connected",
          description: "Successfully connected to EEG device",
        });
      }, 2000);
    } else if (connectionState === ConnectionState.CONNECTED) {
      setConnectionState(ConnectionState.DISCONNECTED);
      setIsDeviceConnected(false);
      setDeviceName("");
      toast({
        title: "Disconnected",
        description: "Device disconnected successfully",
      });
    }
  };

  return (
    <Card className="connection-card overflow-hidden">
      <div
        className={`h-2 w-full ${
          connectionState === ConnectionState.CONNECTED
            ? "bg-green-500"
            : connectionState === ConnectionState.CONNECTING
            ? "bg-amber-500"
            : "bg-slate-300"
        }`}
      />
      <CardHeader>
        <CardTitle>EEG Device Connection</CardTitle>
        <CardDescription>
          Connect your EEG device to start monitoring your brain activity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-6">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
            connectionState === ConnectionState.CONNECTED
              ? "border-green-500 animate-pulse-brain"
              : connectionState === ConnectionState.CONNECTING
              ? "border-amber-500"
              : "border-slate-300"
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold">
              {connectionState === ConnectionState.CONNECTED ? "ON" : 
               connectionState === ConnectionState.CONNECTING ? "..." : "OFF"}
            </div>
            <div className="text-xs mt-1">
              {connectionState === ConnectionState.CONNECTED
                ? "Connected"
                : connectionState === ConnectionState.CONNECTING
                ? "Connecting"
                : "Disconnected"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleConnect}
          variant={connectionState === ConnectionState.CONNECTED ? "destructive" : "default"}
          disabled={connectionState === ConnectionState.CONNECTING}
          className="w-full"
        >
          {connectionState === ConnectionState.CONNECTED
            ? "Disconnect"
            : connectionState === ConnectionState.CONNECTING
            ? "Connecting..."
            : "Connect Device"}
        </Button>
      </CardFooter>
    </Card>
  );
};
