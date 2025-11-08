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
  const [activeTab, setActiveTab] = useState("resources");

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
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

            <DynamicAnalytics activeTab={activeTab} />
          </div>

          <div className="space-y-4">
            <Card className="card-gradient border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Copilot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar" data-testid="chat-history">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground text-xs py-12">
                      <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-40" />
                      <p className="text-xs">Ask about sustainability,</p>
                      <p className="text-xs">carbon, or eco-tips</p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-xs ${
                          msg.role === "user"
                            ? "bg-primary/10 ml-6"
                            : "bg-muted/50 mr-6"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask AI..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={sendMessage.isPending}
                    className="text-sm h-9"
                    data-testid="input-chat-message"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || sendMessage.isPending}
                    className="gradient-nature border-0 shrink-0"
                    data-testid="button-send-message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-xs">Resources</span>
                  <Badge variant="secondary" className="text-xs h-5">{stats?.totalResources || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-xs">Eco-Routes</span>
                  <Badge variant="secondary" className="text-xs h-5">{stats?.totalRoutes || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-xs">Issues Reported</span>
                  <Badge variant="secondary" className="text-xs h-5">{stats?.totalIssues || 0}</Badge>
                </div>
                <div className="p-2.5 rounded-lg gradient-nature text-white mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Total Impact</span>
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xl font-bold">{user?.ecoPoints || 0} Points</p>
                  <p className="text-xs opacity-90">Level {user?.level || 1}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicAnalytics({ activeTab }: { activeTab: string }) {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const analytics = analyticsData as any;

  const chartConfigs = {
    resources: {
      title: "Resource Consumption Trend",
      description: "Track your resource usage patterns",
      icon: Zap,
      component: (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={analytics?.resourceBreakdown || []}>
            <defs>
              <linearGradient id="resourceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="resourceType" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: any) => [value, 'Amount']}
            />
            <Bar dataKey="totalAmount" fill="url(#resourceGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    navigation: {
      title: "Carbon Savings from Eco-Routes",
      description: "CO₂ emissions reduced through sustainable travel",
      icon: Leaf,
      component: (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={analytics?.carbonSavingsHistory || []}>
            <defs>
              <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: any) => [`${value} kg`, 'CO₂ Saved']}
            />
            <Area 
              type="monotone" 
              dataKey="carbonSaved" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fill="url(#carbonGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    waste: {
      title: "Waste Classification Trend",
      description: "Track your waste sorting and recycling activity",
      icon: Recycle,
      component: (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={analytics?.wasteClassificationHistory || []}>
            <defs>
              <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: any) => [value, 'Items Classified']}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fill="url(#wasteGradient)"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    irrigation: {
      title: "Eco-Points Growth",
      description: "Your overall sustainability impact over time",
      icon: TrendingUp,
      component: (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={analytics?.ecoPointsHistory || []}>
            <defs>
              <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickMargin={8}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: any) => [value, 'Eco-Points']}
            />
            <Area 
              type="monotone" 
              dataKey="points" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fill="url(#pointsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  };

  const config = chartConfigs[activeTab as keyof typeof chartConfigs] || chartConfigs.resources;
  const Icon = config.icon;

  return (
    <Card className="card-gradient" data-testid="dynamic-analytics-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {config.component}
      </CardContent>
    </Card>
  );
}