import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Leaf, TrendingUp, Award, MapPin, Recycle, Droplets, 
  Zap, MessageSquare, Send, Sparkles, Activity, BarChart3 
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
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
              <TabsList className="grid w-full grid-cols-5">
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
                <TabsTrigger value="analytics" data-testid="tab-analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
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

              <TabsContent value="analytics" className="mt-6">
                <AnalyticsTab />
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

function AnalyticsTab() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="card-gradient">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="card-gradient">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const analytics = analyticsData as any;
  const totalPoints = analytics?.ecoPointsHistory?.[analytics.ecoPointsHistory.length - 1]?.points || 0;
  const totalCarbon = analytics?.carbonSavingsHistory?.[analytics.carbonSavingsHistory.length - 1]?.carbonSaved || 0;
  const mostUsedResource = analytics?.resourceBreakdown?.reduce((max: any, resource: any) => 
    resource.count > (max?.count || 0) ? resource : max, null
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient hover-elevate" data-testid="card-total-points">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Total Eco-Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient hover-elevate" data-testid="card-carbon-saved">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalCarbon.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient hover-elevate" data-testid="card-most-used">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{mostUsedResource?.resourceType || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Most Tracked Resource</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Eco-Points Trend
            </CardTitle>
            <CardDescription>Cumulative points over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.ecoPointsHistory || []}>
                <defs>
                  <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => `Date: ${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#pointsGradient)"
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Carbon Savings
            </CardTitle>
            <CardDescription>Cumulative CO₂ saved over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.carbonSavingsHistory || []}>
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value: any) => [`${value} kg`, 'CO₂ Saved']}
                />
                <Area 
                  type="monotone" 
                  dataKey="carbonSaved" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#carbonGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Resource Consumption
            </CardTitle>
            <CardDescription>Total usage by resource type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.resourceBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="resourceType" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'totalAmount') return [value, 'Total Amount'];
                    if (name === 'count') return [value, 'Entries'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="totalAmount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Breakdown
            </CardTitle>
            <CardDescription>Distribution of tracked activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.activityBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {(analytics?.activityBreakdown || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}