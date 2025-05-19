
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    sessionDuration: 25, // in minutes
    breakInterval: 5, // in minutes
    notifications: true,
    soundEffects: true,
    darkMode: false,
  });

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Handle settings changes
  const handleSettingChange = (setting: string, value: any) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem("userSettings", JSON.stringify(newSettings));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  // Clear all user data
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
      localStorage.removeItem("focusSessions");
      toast({
        title: "Data Cleared",
        description: "All your session data has been removed",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your focus sessions and application preferences
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user?.name || "User"} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || "user@example.com"} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Session Settings</CardTitle>
            <CardDescription>Configure your focus session preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="sessionDuration">Focus Session Duration</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.sessionDuration} minutes
                </span>
              </div>
              <Slider
                id="sessionDuration"
                min={5}
                max={120}
                step={5}
                value={[settings.sessionDuration]}
                onValueChange={([value]) => handleSettingChange("sessionDuration", value)}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 25-50 minutes for optimal focus
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="breakInterval">Break Interval</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.breakInterval} minutes
                </span>
              </div>
              <Slider
                id="breakInterval"
                min={1}
                max={15}
                step={1}
                value={[settings.breakInterval]}
                onValueChange={([value]) => handleSettingChange("breakInterval", value)}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 5 minutes break between focus sessions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Customize the app behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts about your focus sessions
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(value) => handleSettingChange("notifications", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="soundEffects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play audio cues during sessions
                </p>
              </div>
              <Switch
                id="soundEffects"
                checked={settings.soundEffects}
                onCheckedChange={(value) => handleSettingChange("soundEffects", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for the application
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(value) => handleSettingChange("darkMode", value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={() => navigate("/home")}>
            Back to Home
          </Button>
          <Button variant="destructive" onClick={handleClearData}>
            Clear All Session Data
          </Button>
          <Button variant="secondary" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
