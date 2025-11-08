import DashboardNavbar from "@/components/DashboardNavbar";
import MetricCard from "@/components/MetricCard";
import EnvironmentalMap from "@/components/EnvironmentalMap";
import AICopilot from "@/components/AICopilot";
import CarbonTracker from "@/components/CarbonTracker";
import WasteClassifier from "@/components/WasteClassifier";
import { Droplets, Wind, Thermometer, Leaf, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <DashboardNavbar />
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            AI Climate Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time environmental monitoring and predictive analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Air Quality Index"
            value="42"
            unit="AQI"
            trend={-12}
            status="good"
            icon={Wind}
            subtitle="Excellent air quality"
          />
          <MetricCard 
            title="Urban Heat Index"
            value="28"
            unit="°C"
            trend={5}
            status="warning"
            icon={Thermometer}
            subtitle="Above seasonal average"
          />
          <MetricCard 
            title="Water Quality"
            value="8.2"
            unit="pH"
            status="good"
            icon={Droplets}
            subtitle="Optimal range"
          />
          <MetricCard 
            title="Carbon Offset"
            value="2.4"
            unit="tons"
            trend={18}
            status="good"
            icon={Leaf}
            subtitle="This month"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnvironmentalMap />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Requires immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-destructive/20 p-1.5">
                      <Thermometer className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">High Heat Alert</p>
                      <p className="text-xs text-muted-foreground">Industrial Zone - 35°C expected</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-yellow-500/20 p-1.5">
                      <Wind className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Moderate AQI</p>
                      <p className="text-xs text-muted-foreground">Downtown - AQI 85</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/20 p-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Positive Trend</p>
                      <p className="text-xs text-muted-foreground">Overall air quality improving</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="waste" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="waste" data-testid="tab-waste">Waste Management</TabsTrigger>
            <TabsTrigger value="carbon" data-testid="tab-carbon">Carbon Tracker</TabsTrigger>
            <TabsTrigger value="ai" data-testid="tab-ai">AI Copilot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="waste" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <WasteClassifier />
              <Card>
                <CardHeader>
                  <CardTitle>Collection Efficiency</CardTitle>
                  <CardDescription>Route optimization insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Route A - Downtown</span>
                        <span className="text-sm text-muted-foreground">92%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Route B - Suburbs</span>
                        <span className="text-sm text-muted-foreground">87%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '87%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Route C - Industrial</span>
                        <span className="text-sm text-muted-foreground">78%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        💡 AI Suggestion: Optimize Route C timing to reduce overflow by 15%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="carbon" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <CarbonTracker />
              <Card>
                <CardHeader>
                  <CardTitle>Reduction Strategies</CardTitle>
                  <CardDescription>AI-powered recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Leaf className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Public Transportation</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Use metro/bus 2 days per week instead of car
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary">Potential savings:</span>
                          <span className="text-xs font-mono">0.3 tons CO₂/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Leaf className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Energy Efficiency</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Switch to LED bulbs and optimize AC usage
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary">Potential savings:</span>
                          <span className="text-xs font-mono">0.2 tons CO₂/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Leaf className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Reduce Food Waste</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Plan meals and compost organic waste
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary">Potential savings:</span>
                          <span className="text-xs font-mono">0.1 tons CO₂/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AICopilot />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used queries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover-elevate active-elevate-2 text-sm">
                    Generate weekly impact report
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover-elevate active-elevate-2 text-sm">
                    Analyze pollution trends
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover-elevate active-elevate-2 text-sm">
                    Optimize waste routes
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover-elevate active-elevate-2 text-sm">
                    Carbon reduction plan
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}