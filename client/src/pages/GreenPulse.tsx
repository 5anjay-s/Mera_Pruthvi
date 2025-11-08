import DashboardNavbar from "@/components/DashboardNavbar";
import IssueReportForm from "@/components/IssueReportForm";
import EcoPointsCard from "@/components/EcoPointsCard";
import Leaderboard from "@/components/Leaderboard";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function GreenPulse() {
  const recentReports = [
    { id: 1, type: "Waste Overflow", location: "Park Avenue", status: "resolved", time: "2 hours ago" },
    { id: 2, type: "Air Pollution", location: "Downtown", status: "in-progress", time: "5 hours ago" },
    { id: 3, type: "Illegal Dumping", location: "Industrial Zone", status: "pending", time: "1 day ago" }
  ];

  const statusConfig = {
    resolved: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
    "in-progress": { icon: Clock, color: "text-yellow-600 dark:text-yellow-500", bg: "bg-yellow-500/10" },
    pending: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <DashboardNavbar />
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-greenpulse-title">
            GreenPulse - Citizen App
          </h1>
          <p className="text-muted-foreground">
            Report issues, track your impact, and earn eco-points
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IssueReportForm />
            
            <Card>
              <CardHeader>
                <CardTitle>My Recent Reports</CardTitle>
                <CardDescription>Track the status of your environmental reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((report) => {
                  const config = statusConfig[report.status as keyof typeof statusConfig];
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={report.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover-elevate"
                      data-testid={`report-${report.id}`}
                    >
                      <div className={`rounded-full p-2 ${config.bg}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm">{report.type}</p>
                          <Badge variant="secondary" className={`${config.bg} ${config.color} border-0 capitalize`}>
                            {report.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{report.location}</span>
                          <span>•</span>
                          <span>{report.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <EcoPointsCard />
            <Leaderboard />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Community Impact</CardTitle>
            <CardDescription>See how our community is making a difference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-mono text-primary mb-1">1,247</div>
                <div className="text-xs text-muted-foreground">Total Reports</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-mono text-primary mb-1">892</div>
                <div className="text-xs text-muted-foreground">Issues Resolved</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-mono text-primary mb-1">5.2K</div>
                <div className="text-xs text-muted-foreground">Active Citizens</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold font-mono text-primary mb-1">72%</div>
                <div className="text-xs text-muted-foreground">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}