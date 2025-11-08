import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Leaf, TrendingUp, Award, MapPin, Recycle, Droplets, 
  Zap, MessageSquare, Send, Sparkles, Activity 
} from "lucide-react";
import ResourceMonitor from "@/components/ResourceMonitor";
import EcoNavigation from "@/components/EcoNavigation";
import SmartWasteClassifier from "@/components/SmartWasteClassifier";
import IrrigationAssistant from "@/components/IrrigationAssistant";
import { apiRequest } from "@/lib/queryClient";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (data: any) => {
      setChatHistory(prev => [
        ...prev,
        { role: "user", content: chatMessage },
        { role: "assistant", content: data.response }
      ]);
      setChatMessage("");
    },
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    sendMessage.mutate(chatMessage);
  };

  const user = (userStats as any)?.user;
  const stats = (userStats as any)?.stats;

  return (
    <div className="min-h-screen gradient-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div></div>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2" data-testid="title-dashboard">
              Mera Pruthvi Dashboard
            </h1>
            <p className="text-muted-foreground">Your sustainability intelligence platform</p>
          </div>
          {user && (
            <div className="text-right">
              <Badge variant="default" className="text-lg px-4 py-2 gradient-nature border-0">
                <Award className="h-4 w-4 mr-2" />
                {user.ecoPoints} Eco-Points
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Level {user.level}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-gradient hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalResources || 0}</p>
                  <p className="text-xs text-muted-foreground">Resources Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalRoutes || 0}</p>
                  <p className="text-xs text-muted-foreground">Eco-Routes Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.carbonSaved?.toFixed(1) || 0} kg</p>
                  <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalIssues || 0}</p>
                  <p className="text-xs text-muted-foreground">Issues Reported</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resources" data-testid="tab-resources">
                  <Zap className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="navigation" data-testid="tab-navigation">
                  <MapPin className="h-4 w-4 mr-2" />
                  Navigation
                </TabsTrigger>
                <TabsTrigger value="waste" data-testid="tab-waste">
                  <Recycle className="h-4 w-4 mr-2" />
                  Waste
                </TabsTrigger>
                <TabsTrigger value="irrigation" data-testid="tab-irrigation">
                  <Droplets className="h-4 w-4 mr-2" />
                  Irrigation
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="resources" className="mt-6">
                <ResourceMonitor />
              </TabsContent>
              
              <TabsContent value="navigation" className="mt-6">
                <EcoNavigation />
              </TabsContent>
              
              <TabsContent value="waste" className="mt-6">
                <SmartWasteClassifier />
              </TabsContent>
              
              <TabsContent value="irrigation" className="mt-6">
                <IrrigationAssistant />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Sustainability Copilot
                </CardTitle>
                <CardDescription>Ask anything about sustainability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[300px] overflow-y-auto space-y-3 mb-4" data-testid="chat-history">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Ask me about carbon footprint,</p>
                        <p>waste management, or eco-tips!</p>
                      </div>
                    ) : (
                      chatHistory.map((msg, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            msg.role === "user"
                              ? "bg-primary/10 ml-8"
                              : "bg-muted/50 mr-8"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask AI assistant..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={sendMessage.isPending}
                      data-testid="input-chat-message"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || sendMessage.isPending}
                      className="gradient-nature border-0"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Resources Monitored</span>
                  <Badge variant="secondary">{stats?.totalResources || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Eco-Routes</span>
                  <Badge variant="secondary">{stats?.totalRoutes || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Environmental Issues</span>
                  <Badge variant="secondary">{stats?.totalIssues || 0}</Badge>
                </div>
                <div className="p-3 rounded-lg gradient-nature text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Impact</span>
                    <Award className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold mt-1">{user?.ecoPoints || 0} Points</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}